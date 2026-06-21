import type { ContractorActualRow, EmployeeExpenseRow, FixedAssetRow } from '@dcs/shared';
import { computeProductCostSummary, type ProductCostConfig } from './dcsSummary.js';

// DCS Summary's family-rollup columns (1-7 of the wide cross-tab) are exact
// column-sums over these specific groups of per-product columns - verified to
// the cent against the workbook for every category row.
const FAMILY_MEMBERSHIP: Record<string, ProductCostConfig[]> = {
  Mainframe: [
    { product: 'BASE' },
    { product: 'DB2' },
    { product: 'EGL' },
    { product: 'STORAGE' },
    { product: 'MFMQ' },
  ],
  Midrange: [
    { product: 'mySQL', assetProduct: 'MYSQL' },
    { product: 'Azure Services', assetProduct: 'AZURE SERVICES' },
    { product: 'Application Hosting', assetProduct: 'APPLICATION HOSTING' },
    { product: 'Oracle Database Hosting', assetProduct: 'ORACLE DATABASE HOSTING' },
    { product: 'SQL Database Hosting', assetProduct: 'SQL DATABASE HOSTING' },
    { product: 'Windows OS', assetProduct: 'WINDOWS OS' },
    { product: 'RedHat OS', assetProduct: 'REDHAT OS' },
    { product: 'Website Hosting Services', assetProduct: 'WEBSITE HOSTING SERVICES' },
    { product: 'Squiz Matrix', assetProduct: 'SQUIZ MATRIX' },
    { product: 'Sharepoint', assetProduct: 'SHAREPOINT' },
    { product: 'VMWare', assetProduct: 'VMWARE' },
    { product: 'Domino / Lotus Notes', assetProduct: 'DOMINO / LOTUS NOTES' },
    { product: 'App Management', assetProduct: 'APP MANAGEMENT' },
    { product: 'Disk Variable', assetProduct: 'DISK VARIABLE' },
    { product: 'Disk Fixed File', assetProduct: 'DISK FIXED FILE' },
  ],
  'Enterprise Storage': [
    { product: 'SAN Storage', assetProduct: 'SAN STORAGE' },
    { product: 'SAN Storage ABS-HSS', assetProduct: 'SAN STORAGE ABS-HSS' },
    { product: 'Backup Storage', assetProduct: 'BACKUP STORAGE' },
  ],
  'GDC Operations': [
    { product: 'Operations' },
    { product: 'Server Hosting GDC', assetProduct: 'SERVER HOSTING GDC', buildingOverhead: 'GDC' },
    { product: 'Server Hosting BDC', assetProduct: 'SERVER HOSTING BDC', buildingOverhead: 'BDC' },
  ],
  'Applications Services': [{ product: 'Application Services', assetProduct: 'APPLICATION SERVICES' }],
};

// "Business Support" is not a sum over any tracked product - it's a standalone
// cost pool, genuinely $0 in every category except Under Pinning Services. See
// server/src/config/underPinningServices.ts and the plan's family-rollup notes.
const BUSINESS_SUPPORT_FAMILY: Record<string, number> = {
  'Under Pinning Services': 52251.96000000001,
  'TOTAL EXPENSES': 52251.96000000001,
  'Total Excluding internal': 0,
};

function sumProductSummaries(
  configs: ProductCostConfig[],
  fixedAssets: FixedAssetRow[],
  employeeExpense: EmployeeExpenseRow[],
  contractorActuals: ContractorActualRow[],
  fiscalYear: 'fy202526' | 'fy202627',
): Record<string, number> {
  const total: Record<string, number> = {};
  for (const config of configs) {
    const summary = computeProductCostSummary(config, fixedAssets, employeeExpense, contractorActuals, fiscalYear);
    for (const [category, value] of Object.entries(summary)) {
      total[category] = (total[category] ?? 0) + value;
    }
  }
  return total;
}

// All ~26 tracked products across every family, flattened - used by the
// /api/summary route to compute each product's own cost build-up row.
export function getAllProductConfigs(): ProductCostConfig[] {
  return Object.values(FAMILY_MEMBERSHIP).flat();
}

export function computeFamilyRollup(
  fixedAssets: FixedAssetRow[],
  employeeExpense: EmployeeExpenseRow[],
  contractorActuals: ContractorActualRow[],
  fiscalYear: 'fy202526' | 'fy202627',
): Record<string, Record<string, number>> {
  const families: Record<string, Record<string, number>> = {
    Mainframe: sumProductSummaries(FAMILY_MEMBERSHIP.Mainframe, fixedAssets, employeeExpense, contractorActuals, fiscalYear),
    Midrange: sumProductSummaries(FAMILY_MEMBERSHIP.Midrange, fixedAssets, employeeExpense, contractorActuals, fiscalYear),
    'Enterprise Storage': sumProductSummaries(
      FAMILY_MEMBERSHIP['Enterprise Storage'],
      fixedAssets,
      employeeExpense,
      contractorActuals,
      fiscalYear,
    ),
    'GDC Operations': sumProductSummaries(
      FAMILY_MEMBERSHIP['GDC Operations'],
      fixedAssets,
      employeeExpense,
      contractorActuals,
      fiscalYear,
    ),
    'Business Support': BUSINESS_SUPPORT_FAMILY,
    'Applications Services': sumProductSummaries(
      FAMILY_MEMBERSHIP['Applications Services'],
      fixedAssets,
      employeeExpense,
      contractorActuals,
      fiscalYear,
    ),
  };

  const dcs: Record<string, number> = {};
  for (const family of Object.values(families)) {
    for (const [category, value] of Object.entries(family)) {
      dcs[category] = (dcs[category] ?? 0) + value;
    }
  }

  return { DCS: dcs, ...families };
}
