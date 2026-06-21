import type { SheetValidation } from '@dcs/shared';
import {
  ASSET_LIFE_MONTHS_OVERRIDE,
  ASSET_PRODUCT_MAP,
  BUSINESS_SUPPORT_OVERHEAD,
  CCS_EXPENSES,
  CONTRACTOR_ALLOCATIONS,
  CORPORATE_STAFF_OVERHEAD,
  EMPLOYEE_ALLOCATIONS,
  FITOUT_OVERHEAD,
  HR_OVERHEAD,
  MAINTENANCE_AND_LICENSES,
  PLANNED_ASSET_ADDITIONS,
  PLAZA3_SHARED_COSTS,
  UNDER_PINNING_SERVICES,
} from '../../config/index.js';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { computeAssets } from './assets.js';
import { computeContractorStaffCosts } from './contractorStaffCosts.js';
import { compareToFixture, loadFixture, readFixtureCsv } from './fixtureTestHelpers.js';
import { computePayrollStaffCosts } from './payrollStaffCosts.js';
import {
  computeBusinessSupportOverhead,
  computeCorporateStaffOverhead,
  computeCostCentreSpecificExpenses,
  computeFitoutOverhead,
  computeHrOverhead,
  computeMaintenanceAndLicenses,
  computePlaza3SharedCosts,
  computeUnderPinningServices,
} from './sharedServiceOverheads.js';

const ASSET_PRODUCT = 'SAN STORAGE ABS-HSS';
const PRODUCT = 'SAN Storage ABS-HSS';

export function runEsStorageSanStorageAbsHssValidation(): SheetValidation {
  const fixture = loadFixture('esStorageSanStorageAbsHss.json');

  const fixedAssets = parseFixedAssetsCsv(readFixtureCsv('rawInputs/FixedAssets.csv'));
  const employeeExpense = parseEmployeeExpenseCsv(readFixtureCsv('rawInputs/Employee_Expense.csv'));
  const contractorActuals = parseContractorActualCsv(readFixtureCsv('rawInputs/Contractor_Actual.csv'));

  const computedByRow: Record<string, number> = {
    Assets: computeAssets(
      fixedAssets,
      ASSET_PRODUCT_MAP,
      ASSET_LIFE_MONTHS_OVERRIDE,
      PLANNED_ASSET_ADDITIONS,
      ASSET_PRODUCT,
      'fy202627',
    ),
    'Payroll Staff Costs': computePayrollStaffCosts(employeeExpense, EMPLOYEE_ALLOCATIONS, PRODUCT),
    'Contractor Staff Costs': computeContractorStaffCosts(
      contractorActuals,
      CONTRACTOR_ALLOCATIONS,
      PRODUCT,
    ),
    HR: computeHrOverhead(HR_OVERHEAD, PRODUCT),
    'Business Support Overhead': computeBusinessSupportOverhead(BUSINESS_SUPPORT_OVERHEAD, PRODUCT),
    'Corporate Staff Overhead': computeCorporateStaffOverhead(CORPORATE_STAFF_OVERHEAD, PRODUCT),
    'Maintenance and Licenses': computeMaintenanceAndLicenses(MAINTENANCE_AND_LICENSES, PRODUCT),
    'Fitout Overhead': computeFitoutOverhead(FITOUT_OVERHEAD, PRODUCT),
    'Cost Centre Specific Expenses': computeCostCentreSpecificExpenses(CCS_EXPENSES, PRODUCT),
    'Under Pinning Services': computeUnderPinningServices(UNDER_PINNING_SERVICES, PRODUCT),
    'Plaza 3 Shared Costs': computePlaza3SharedCosts(PLAZA3_SHARED_COSTS, PRODUCT),
  };

  const results = compareToFixture(computedByRow, fixture, '2026-27');
  return { sheetName: fixture.sheetName, results };
}

