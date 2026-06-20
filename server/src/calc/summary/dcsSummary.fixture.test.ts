import { describe, it } from 'vitest';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { compareToFixture, readFixtureCsv, reportAndAssertResults, FIXTURES_DIR } from '../costBuildUp/fixtureTestHelpers.js';
import { computeProductCostSummary, type ProductCostConfig } from './dcsSummary.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// DCS Summary's wide cross-tab (rows 17-41) restates the same per-product cost
// categories already proven on each product's own cost build-up sheet fixture.
// This is an integration cross-check, not new calculation logic: every value here
// is expected to match the already-fixture-tested per-sheet calculators exactly.
const PRODUCT_CONFIGS: Record<string, ProductCostConfig> = {
  Operations: { product: 'Operations' },
  'Server Hosting GDC': { product: 'Server Hosting GDC', assetProduct: 'SERVER HOSTING GDC', buildingOverhead: 'GDC' },
  'Server Hosting BDC': { product: 'Server Hosting BDC', assetProduct: 'SERVER HOSTING BDC', buildingOverhead: 'BDC' },
  BASE: { product: 'BASE' },
  'MF MQ': { product: 'MFMQ' },
  DB2: { product: 'DB2' },
  EGL: { product: 'EGL' },
  STORAGE: { product: 'STORAGE' },
  'Application Services': { product: 'Application Services', assetProduct: 'APPLICATION SERVICES' },
};

type DcsSummaryFixture = {
  sheetName: string;
  source: string;
  products: Record<string, Record<string, Record<string, number>>>;
};

function loadDcsSummaryFixture(): DcsSummaryFixture {
  return JSON.parse(readFileSync(path.join(FIXTURES_DIR, 'dcsSummary.json'), 'utf-8')) as DcsSummaryFixture;
}

describe('DCS Summary fixture checkpoint', () => {
  const fixture = loadDcsSummaryFixture();

  const fixedAssets = parseFixedAssetsCsv(readFixtureCsv('rawInputs/FixedAssets.csv'));
  const employeeExpense = parseEmployeeExpenseCsv(readFixtureCsv('rawInputs/Employee_Expense.csv'));
  const contractorActuals = parseContractorActualCsv(readFixtureCsv('rawInputs/Contractor_Actual.csv'));

  for (const [fixtureProduct, config] of Object.entries(PRODUCT_CONFIGS)) {
    it(`computes ${fixtureProduct} rows against the workbook's stored DCS Summary 2026-27 values`, () => {
      const computedByRow = computeProductCostSummary(
        config,
        fixedAssets,
        employeeExpense,
        contractorActuals,
        'fy202627',
      );

      const results = compareToFixture(computedByRow, { ...fixture, rows: fixture.products[fixtureProduct] }, '2026-27');
      reportAndAssertResults(`${fixture.sheetName} (${fixtureProduct})`, results);
    });
  }
});
