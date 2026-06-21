// Browser-safe re-export barrel - every module reachable from here (parsers,
// calc, session) is plain TS with no Node-only built-ins, so this can be
// imported directly by the client for an offline, serverless build. Routes
// in index.ts and Express/cors are deliberately NOT re-exported here.
export { parseContractorActualCsv } from './parsers/contractorActual.js';
export { parseEmployeeExpenseCsv } from './parsers/employeeExpense.js';
export { parseFixedAssetsCsv } from './parsers/fixedAssets.js';
export { parseMainframeUsageCsv } from './parsers/mainframeUsage.js';
export { computeProductCostSummary, type ProductCostConfig } from './calc/summary/dcsSummary.js';
export { computeFamilyRollup, getAllProductConfigs } from './calc/summary/familyRollup.js';
export { computePivotAgency } from './calc/usageAllocation/pivotAgency.js';
export { buildPriceBook, computeRevenueFromPriceBook } from './calc/pricing/priceBookRevenue.js';
export { computeProfit } from './calc/pricing/revenue.js';
export {
  getMissingUploads,
  getSession,
  getUploadStatus,
  setContractorActuals,
  setEmployeeExpense,
  setFixedAssets,
  setMainframeUsage,
  setRateOverride,
} from './session.js';
