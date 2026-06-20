import type { AsDataRow } from '@dcs/shared';

export type AsSummaryRow = {
  totalHours: number;
  billable: number;
  nonBillable: number;
};

export function computeAsSummary(asData: AsDataRow[]): Record<string, AsSummaryRow> {
  const summary: Record<string, AsSummaryRow> = {};
  for (const row of asData) {
    const entry = (summary[row.contractor] ??= { totalHours: 0, billable: 0, nonBillable: 0 });
    entry.totalHours += row.hoursWorked;
    if (row.project === 'NON-BILLABLE') {
      entry.nonBillable += row.hoursWorked;
    } else {
      entry.billable += row.hoursWorked;
    }
  }
  return summary;
}
