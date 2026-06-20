import type { DasdUsageRow } from '@dcs/shared';

export function computeDasdCharge(usage: DasdUsageRow[], storageChargePool: number): Record<string, number> {
  const totalGb = usage.reduce((sum, row) => sum + row.grandTotalGb, 0);

  const charges: Record<string, number> = {};
  for (const row of usage) {
    charges[row.agency] = (row.grandTotalGb / totalGb) * storageChargePool;
  }
  return charges;
}
