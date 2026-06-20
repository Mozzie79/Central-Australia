// GDC Building Overheads / BDC Overhead are static per-destination dollar tables
// stored directly in the workbook, not formulas to derive — see
// server/src/config/buildingOverheads.ts.
export function computeGdcBuildingOverheads(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

export function computeBdcOverhead(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}
