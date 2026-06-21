import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { computeProfit } from './calc/pricing/revenue.js';
import { buildPriceBook, computeRevenueFromPriceBook } from './calc/pricing/priceBookRevenue.js';
import { computeProductCostSummary } from './calc/summary/dcsSummary.js';
import { computeFamilyRollup, getAllProductConfigs } from './calc/summary/familyRollup.js';
import { computePivotAgency } from './calc/usageAllocation/pivotAgency.js';
import { runAllValidations } from './validation/runAllValidations.js';
import { parseContractorActualCsv } from './parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from './parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from './parsers/fixedAssets.js';
import { parseMainframeUsageCsv } from './parsers/mainframeUsage.js';
import {
  getMissingUploads,
  getSession,
  getUploadStatus,
  setContractorActuals,
  setEmployeeExpense,
  setFixedAssets,
  setMainframeUsage,
  setRateOverride,
} from './session.js';

const app = express();
app.use(cors());
// Mainframe usage CSV (~90k rows) sent as a JSON string body comfortably exceeds
// express's 100kb default limit.
app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const csvBodySchema = z.object({ csv: z.string() });

const UPLOAD_HANDLERS: Record<string, (csv: string) => number> = {
  'fixed-assets': (csv) => {
    const rows = parseFixedAssetsCsv(csv);
    setFixedAssets(rows);
    return rows.length;
  },
  'employee-expense': (csv) => {
    const rows = parseEmployeeExpenseCsv(csv);
    setEmployeeExpense(rows);
    return rows.length;
  },
  'contractor-actual': (csv) => {
    const rows = parseContractorActualCsv(csv);
    setContractorActuals(rows);
    return rows.length;
  },
  'mainframe-usage': (csv) => {
    const rows = parseMainframeUsageCsv(csv);
    setMainframeUsage(rows);
    return rows.length;
  },
};

app.post('/api/uploads/:fileType', (req, res) => {
  const handler = UPLOAD_HANDLERS[req.params.fileType];
  if (!handler) {
    res.status(404).json({ error: `Unknown upload type: ${req.params.fileType}` });
    return;
  }

  const body = csvBodySchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: 'Request body must be { csv: string }' });
    return;
  }

  try {
    const rowCount = handler(body.data.csv);
    res.json({ rowCount });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to parse CSV' });
  }
});

app.get('/api/uploads', (_req, res) => {
  res.json(getUploadStatus());
});

app.get('/api/price-book', (_req, res) => {
  const { mainframeUsage, rateOverrides } = getSession();
  const usageByAgency = computePivotAgency(mainframeUsage ?? []);
  res.json(buildPriceBook(usageByAgency, rateOverrides));
});

const rateBodySchema = z.object({ rate: z.number() });

app.put('/api/price-book/:id', (req, res) => {
  const body = rateBodySchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: 'Request body must be { rate: number }' });
    return;
  }

  setRateOverride(req.params.id, body.data.rate);

  const { mainframeUsage, rateOverrides } = getSession();
  const usageByAgency = computePivotAgency(mainframeUsage ?? []);
  res.json(buildPriceBook(usageByAgency, rateOverrides));
});

app.get('/api/summary', (_req, res) => {
  const missing = getMissingUploads();
  if (missing.length > 0) {
    res.status(409).json({ missing });
    return;
  }

  const { fixedAssets, employeeExpense, contractorActuals, mainframeUsage, rateOverrides } = getSession();
  const usageByAgency = computePivotAgency(mainframeUsage!);
  const priceBook = buildPriceBook(usageByAgency, rateOverrides);

  const products: Record<string, { cost: Record<string, number>; revenue: number | null; profit: number | null }> = {};
  for (const config of getAllProductConfigs()) {
    const cost = computeProductCostSummary(config, fixedAssets!, employeeExpense!, contractorActuals!, 'fy202627');
    const revenue = computeRevenueFromPriceBook(config.product, priceBook);
    // Profit basis is TOTAL EXPENSES (the architectural rule's "Total Expense") - not
    // independently fixture-verified against the workbook's own Profit/Loss rows (see
    // the Application Services discrepancy noted in the plan's Session N+6 progress).
    const profit = revenue === null ? null : computeProfit(revenue, cost['TOTAL EXPENSES']);
    products[config.product] = { cost, revenue, profit };
  }

  const families = computeFamilyRollup(fixedAssets!, employeeExpense!, contractorActuals!, 'fy202627');

  res.json({ products, families });
});

app.get('/api/validation', (_req, res) => {
  res.json({ sheets: runAllValidations() });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
