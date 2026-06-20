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

// "Maintenance and Licenses" is the same kind of static per-destination dollar
// table - see server/src/config/maintenanceAndLicenses.ts.
export function computeMaintenanceAndLicenses(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

// "Fitout Overhead" is the same kind of static per-destination dollar table -
// see server/src/config/fitoutOverhead.ts.
export function computeFitoutOverhead(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

// "Cost Centre Specific Expenses" is the same kind of static per-destination
// dollar table - see server/src/config/ccsExpenses.ts.
export function computeCostCentreSpecificExpenses(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

// "Under Pinning Services" is the same kind of static per-destination dollar
// table, but sourced from DCS Summary itself rather than independently
// cross-validated - see server/src/config/underPinningServices.ts.
export function computeUnderPinningServices(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}

// "Plaza 3 Shared Costs" is the same kind of static per-destination dollar
// table, also sourced from DCS Summary itself rather than independently
// cross-validated — see server/src/config/plaza3SharedCosts.ts.
export function computePlaza3SharedCosts(map: Record<string, number>, product: string): number {
  return map[product] ?? 0;
}
