import type { SheetValidation } from '@dcs/shared';
import {
  ASSET_LIFE_MONTHS_OVERRIDE,
  ASSET_PRODUCT_MAP,
  BUSINESS_SUPPORT_OVERHEAD,
  CCS_EXPENSES,
  CONTRACTOR_ALLOCATIONS,
  CORPORATE_STAFF_OVERHEAD,
  EMPLOYEE_ALLOCATIONS,
  GDC_BUILDING_OVERHEAD,
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
import { computeGdcBuildingOverheads } from './buildingOverheads.js';
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

// ASSET_PRODUCT_MAP uses the uppercase tag; EMPLOYEE_ALLOCATIONS and the shared
// overhead lookups use the sheet-literal title-case label. These are not the same
// string and must not be normalized into one constant.
const ASSET_PRODUCT = 'SERVER HOSTING GDC';
const PRODUCT = 'Server Hosting GDC';

export function runServerHostingGdcValidation(): SheetValidation {
  const fixture = loadFixture('serverHostingGdc.json');

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
    'GDC Building Overheads': computeGdcBuildingOverheads(GDC_BUILDING_OVERHEAD, PRODUCT),
  };

  const results = compareToFixture(computedByRow, fixture, '2026-27');
  return { sheetName: fixture.sheetName, results };
}

