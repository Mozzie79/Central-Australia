import type { MainframeUsageRow } from '@dcs/shared';

export function computePivotAgency(usage: MainframeUsageRow[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const row of usage) {
    totals[row.agency] = (totals[row.agency] ?? 0) + row.cpuSecs;
  }
  return totals;
}
