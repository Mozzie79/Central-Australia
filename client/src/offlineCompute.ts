// In-browser implementation of the same operations index.ts's Express routes
// perform, for the offline single-file build (vite.offline.config.ts) - no
// server, no network calls. Logic is a direct port of server/src/index.ts's
// route handlers onto the same @dcs/server functions, including reusing
// session.ts as-is for this build's in-memory session state.
import {
  buildPriceBook,
  computeFamilyRollup,
  computePivotAgency,
  computeProductCostSummary,
  computeProfit,
  computeRevenueFromPriceBook,
  getAllProductConfigs,
  getMissingUploads,
  getSession,
  getUploadStatus as getSessionUploadStatus,
  parseContractorActualCsv,
  parseEmployeeExpenseCsv,
  parseFixedAssetsCsv,
  parseMainframeUsageCsv,
  setContractorActuals,
  setEmployeeExpense,
  setFixedAssets,
  setMainframeUsage,
  setRateOverride,
} from '@dcs/server';
import type { PriceBookLineItem } from '@dcs/shared';
import type { SummaryResponse, UploadFileType, UploadStatus } from './api';

const UPLOAD_HANDLERS: Record<UploadFileType, (csv: string) => number> = {
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

export async function getUploadStatus(): Promise<UploadStatus> {
  return getSessionUploadStatus();
}

export async function uploadFile(fileType: UploadFileType, csv: string): Promise<{ rowCount: number }> {
  const rowCount = UPLOAD_HANDLERS[fileType](csv);
  return { rowCount };
}

export async function getPriceBook(): Promise<PriceBookLineItem[]> {
  const { mainframeUsage, rateOverrides } = getSession();
  const usageByAgency = computePivotAgency(mainframeUsage ?? []);
  return buildPriceBook(usageByAgency, rateOverrides);
}

export async function updatePriceBookRate(id: string, rate: number): Promise<PriceBookLineItem[]> {
  setRateOverride(id, rate);
  return getPriceBook();
}

export async function getSummary(): Promise<SummaryResponse> {
  const missing = getMissingUploads();
  if (missing.length > 0) {
    throw Object.assign(new Error('Missing uploads'), { body: { missing } });
  }

  const { fixedAssets, employeeExpense, contractorActuals, mainframeUsage, rateOverrides } = getSession();
  const usageByAgency = computePivotAgency(mainframeUsage!);
  const priceBook = buildPriceBook(usageByAgency, rateOverrides);

  const products: SummaryResponse['products'] = {};
  for (const config of getAllProductConfigs()) {
    const cost = computeProductCostSummary(config, fixedAssets!, employeeExpense!, contractorActuals!, 'fy202627');
    const revenue = computeRevenueFromPriceBook(config.product, priceBook);
    const profit = revenue === null ? null : computeProfit(revenue, cost['TOTAL EXPENSES']);
    products[config.product] = { cost, revenue, profit };
  }

  const families = computeFamilyRollup(fixedAssets!, employeeExpense!, contractorActuals!, 'fy202627');

  return { products, families };
}
