export enum CostCategory {
  Assets = 'Assets',
  Licenses = 'Licenses',
  MaintenanceAndLicenses = 'MaintenanceAndLicenses',
  HR = 'HR',
  PayrollStaffCosts = 'PayrollStaffCosts',
  ContractorStaffCosts = 'ContractorStaffCosts',
  BusinessSupportOverhead = 'BusinessSupportOverhead',
  CorporateStaffOverhead = 'CorporateStaffOverhead',
  SharedCostOverhead = 'SharedCostOverhead',
  Plaza3SharedCosts = 'Plaza3SharedCosts',
  CostCentreSpecific = 'CostCentreSpecific',
  Internal = 'Internal',
  TotalExpense = 'TotalExpense',
}

export type FiscalYear = string; // e.g. "2026-27"

export type CostBuildUpRowConfig = {
  category: CostCategory;
  glCodes: number[];
};

export type CostBuildUpSheetConfig = {
  sheetName: string;
  productCodes: string[];
  rows: CostBuildUpRowConfig[];
};

export type CostBuildUpRowResult = {
  category: CostCategory;
  valuesByYear: Record<FiscalYear, number>;
};

export type CostBuildUpResult = {
  sheetName: string;
  rows: CostBuildUpRowResult[];
};
