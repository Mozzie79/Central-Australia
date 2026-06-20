import type { ContractorActualRow, EmployeeExpenseRow, FixedAssetRow } from '@dcs/shared';
import {
  ASSET_LIFE_MONTHS_OVERRIDE,
  ASSET_PRODUCT_MAP,
  BDC_OVERHEAD,
  BUSINESS_SUPPORT_OVERHEAD,
  CCS_EXPENSES,
  CONTRACTOR_ALLOCATIONS,
  CORPORATE_STAFF_OVERHEAD,
  EMPLOYEE_ALLOCATIONS,
  FITOUT_OVERHEAD,
  GDC_BUILDING_OVERHEAD,
  HR_OVERHEAD,
  MAINTENANCE_AND_LICENSES,
  PLANNED_ASSET_ADDITIONS,
  UNDER_PINNING_SERVICES,
} from '../../config/index.js';
import { computeAssets } from '../costBuildUp/assets.js';
import { computeBdcOverhead, computeGdcBuildingOverheads } from '../costBuildUp/buildingOverheads.js';
import { computeContractorStaffCosts } from '../costBuildUp/contractorStaffCosts.js';
import { computePayrollStaffCosts } from '../costBuildUp/payrollStaffCosts.js';
import {
  computeBusinessSupportOverhead,
  computeCorporateStaffOverhead,
  computeCostCentreSpecificExpenses,
  computeFitoutOverhead,
  computeHrOverhead,
  computeMaintenanceAndLicenses,
  computeUnderPinningServices,
} from '../costBuildUp/sharedServiceOverheads.js';

export type ProductCostConfig = {
  product: string;
  // ASSET_PRODUCT_MAP uses an upper-case tag for some products while the other
  // static lookups use the sheet-literal title-case label - these are not the
  // same string and must not be normalized into one constant.
  assetProduct?: string;
  buildingOverhead?: 'GDC' | 'BDC';
};

// DCS Summary's wide cross-tab (rows 17-41) re-states the same per-product cost
// categories already computed and fixture-verified on each product's own cost
// build-up sheet. This orchestrator re-runs those same calculators per product
// rather than re-deriving anything new, which is what lets it serve as an
// independent cross-validation of the whole chain.
export function computeProductCostSummary(
  config: ProductCostConfig,
  fixedAssets: FixedAssetRow[],
  employeeExpense: EmployeeExpenseRow[],
  contractorActuals: ContractorActualRow[],
  fiscalYear: 'fy202526' | 'fy202627',
): Record<string, number> {
  const { product, assetProduct = product, buildingOverhead } = config;

  const summary: Record<string, number> = {
    Assets: computeAssets(
      fixedAssets,
      ASSET_PRODUCT_MAP,
      ASSET_LIFE_MONTHS_OVERRIDE,
      PLANNED_ASSET_ADDITIONS,
      assetProduct,
      fiscalYear,
    ),
    'Payroll Staff Costs': computePayrollStaffCosts(employeeExpense, EMPLOYEE_ALLOCATIONS, product),
    'Contractor Staff Costs': computeContractorStaffCosts(contractorActuals, CONTRACTOR_ALLOCATIONS, product),
    'Business Support HR Overhead': computeHrOverhead(HR_OVERHEAD, product),
    'Corporate Staff Overhead': computeCorporateStaffOverhead(CORPORATE_STAFF_OVERHEAD, product),
    'Business Support Overhead': computeBusinessSupportOverhead(BUSINESS_SUPPORT_OVERHEAD, product),
    'Maintenance and Licenses': computeMaintenanceAndLicenses(MAINTENANCE_AND_LICENSES, product),
    'Fitout Overhead': computeFitoutOverhead(FITOUT_OVERHEAD, product),
    'Cost Centre Specific Expenses': computeCostCentreSpecificExpenses(CCS_EXPENSES, product),
    'Under Pinning Services': computeUnderPinningServices(UNDER_PINNING_SERVICES, product),
  };

  if (buildingOverhead === 'GDC') {
    summary['GDC Building Overheads'] = computeGdcBuildingOverheads(GDC_BUILDING_OVERHEAD, product);
  }
  if (buildingOverhead === 'BDC') {
    summary['BDC Overhead'] = computeBdcOverhead(BDC_OVERHEAD, product);
  }

  return summary;
}
