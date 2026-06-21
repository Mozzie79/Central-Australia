import type { RowResult } from '@dcs/shared';
import { expect } from 'vitest';

export function reportAndAssertResults(sheetName: string, results: RowResult[]): void {
  console.table(
    results.map((r) => ({
      row: r.row,
      computed: r.computed.toFixed(2),
      expected: r.expected.toFixed(2),
      diffPct: Number.isFinite(r.diffPct) ? (r.diffPct * 100).toFixed(2) + '%' : 'n/a',
      status: r.status,
    })),
  );

  for (const r of results) {
    expect(r.status, `${sheetName} ${r.row} (computed ${r.computed.toFixed(2)} vs expected ${r.expected.toFixed(2)}) is flagged`).not.toBe(
      'flagged',
    );
  }
}
