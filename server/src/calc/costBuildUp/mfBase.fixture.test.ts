import { describe, it } from 'vitest';
import {
  ASSET_LIFE_MONTHS_OVERRIDE,
  ASSET_PRODUCT_MAP,
  CONTRACTOR_ALLOCATIONS,
  EMPLOYEE_ALLOCATIONS,
  PLANNED_ASSET_ADDITIONS,
} from '../../config/index.js';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { computeAssets } from './assets.js';
import { computeContractorStaffCosts } from './contractorStaffCosts.js';
import { compareToFixture, loadFixture, readFixtureCsv, reportAndAssertResults } from './fixtureTestHelpers.js';
import { computePayrollStaffCosts } from './payrollStaffCosts.js';

const PRODUCT = 'BASE';

describe('MF BASE Phase 3 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor rows against the workbook\'s stored 2026-27 values', () => {
    const fixture = loadFixture('mfBase.json');

    const fixedAssets = parseFixedAssetsCsv(readFixtureCsv('rawInputs/FixedAssets.csv'));
    const employeeExpense = parseEmployeeExpenseCsv(readFixtureCsv('rawInputs/Employee_Expense.csv'));
    const contractorActuals = parseContractorActualCsv(readFixtureCsv('rawInputs/Contractor_Actual.csv'));

    const computedByRow: Record<string, number> = {
      Assets: computeAssets(
        fixedAssets,
        ASSET_PRODUCT_MAP,
        ASSET_LIFE_MONTHS_OVERRIDE,
        PLANNED_ASSET_ADDITIONS,
        PRODUCT,
        'fy202627',
      ),
      'Payroll Staff Costs': computePayrollStaffCosts(employeeExpense, EMPLOYEE_ALLOCATIONS, PRODUCT),
      'Contractor Staff Costs': computeContractorStaffCosts(
        contractorActuals,
        CONTRACTOR_ALLOCATIONS,
        PRODUCT,
      ),
    };

    const results = compareToFixture(computedByRow, fixture, '2026-27');
    reportAndAssertResults(fixture.sheetName, results);
  });
});
