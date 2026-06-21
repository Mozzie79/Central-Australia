import type { ContractorActualRow, EmployeeExpenseRow, FixedAssetRow, MainframeUsageRow } from '@dcs/shared';

// In-memory state for the single local user/session - no database, resets on
// server restart, per the project's confirmed v1 scope.
type Session = {
  fixedAssets?: FixedAssetRow[];
  employeeExpense?: EmployeeExpenseRow[];
  contractorActuals?: ContractorActualRow[];
  mainframeUsage?: MainframeUsageRow[];
  rateOverrides: Map<string, number>;
};

const session: Session = { rateOverrides: new Map() };

export function setFixedAssets(rows: FixedAssetRow[]) {
  session.fixedAssets = rows;
}

export function setEmployeeExpense(rows: EmployeeExpenseRow[]) {
  session.employeeExpense = rows;
}

export function setContractorActuals(rows: ContractorActualRow[]) {
  session.contractorActuals = rows;
}

export function setMainframeUsage(rows: MainframeUsageRow[]) {
  session.mainframeUsage = rows;
}

export function setRateOverride(id: string, rate: number) {
  session.rateOverrides.set(id, rate);
}

export function getUploadStatus() {
  return {
    fixedAssets: session.fixedAssets !== undefined,
    employeeExpense: session.employeeExpense !== undefined,
    contractorActual: session.contractorActuals !== undefined,
    mainframeUsage: session.mainframeUsage !== undefined,
  };
}

export function getSession(): Session {
  return session;
}

export function getMissingUploads(): string[] {
  const missing: string[] = [];
  if (!session.fixedAssets) missing.push('fixedAssets');
  if (!session.employeeExpense) missing.push('employeeExpense');
  if (!session.contractorActuals) missing.push('contractorActuals');
  if (!session.mainframeUsage) missing.push('mainframeUsage');
  return missing;
}
