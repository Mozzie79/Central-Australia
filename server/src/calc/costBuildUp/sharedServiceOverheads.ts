// HR / Business Support Overhead / Corporate Staff Overhead are static
// per-destination dollar tables stored directly in the workbook, not formulas
// to derive — see server/src/config/sharedServiceOverheads.ts.
export function computeHrOverhead(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

export function computeBusinessSupportOverhead(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

export function computeCorporateStaffOverhead(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}
