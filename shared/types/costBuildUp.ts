export type CostCategory =
  | 'Assets'
  | 'Licenses'
  | 'MaintenanceAndLicenses'
  | 'HR'
  | 'PayrollStaffCosts'
  | 'ContractorStaffCosts'
  | 'BusinessSupportOverhead'
  | 'CorporateStaffOverhead'
  | 'SharedCostOverhead'
  | 'Plaza3SharedCosts'
  | 'CostCentreSpecific'
  | 'Internal'
  | 'TotalExpense';

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
