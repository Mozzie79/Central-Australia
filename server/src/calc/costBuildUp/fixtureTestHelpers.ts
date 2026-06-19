import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';

export const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');

export type FixtureFile = {
  sheetName: string;
  source: string;
  rows: Record<string, Record<string, number>>;
};

export type RowResult = {
  row: string;
  computed: number;
  expected: number;
  diffPct: number;
  status: 'matched' | 'approximate' | 'flagged';
};

// Tolerance is "within 1% or $5, whichever is larger" (per the plan's proposed threshold).
// For an expected value of exactly 0, percentage diff is undefined, so fall back to the
// flat $5 absolute tolerance.
//
// Payroll Staff Costs gets a wider tolerance: the Mainframe family's per-product split is a
// flat headcount ratio, but the real $/FTE rate varies by product's role mix, and the
// Employee Expense source has no per-product compensation detail to do better with
// (investigated and confirmed during Phase 4 - see the plan's "Open Items" log).
const ROW_TOLERANCE_PCT: Record<string, number> = {
  'Payroll Staff Costs': 0.1,
};

function classify(diff: number, expected: number, row: string): RowResult['status'] {
  const tolerancePct = ROW_TOLERANCE_PCT[row] ?? 0.01;
  if (expected === 0) return diff <= 5 ? 'matched' : 'flagged';
  const diffPct = diff / Math.abs(expected);
  if (diffPct <= 0.001) return 'matched';
  if (diffPct <= tolerancePct || diff <= 5) return 'approximate';
  return 'flagged';
}

export function loadFixture(fileName: string): FixtureFile {
  return JSON.parse(readFileSync(path.join(FIXTURES_DIR, fileName), 'utf-8')) as FixtureFile;
}

export function readFixtureCsv(relativePath: string): string {
  return readFileSync(path.join(FIXTURES_DIR, relativePath), 'utf-8');
}

export function compareToFixture(
  computedByRow: Record<string, number>,
  fixture: FixtureFile,
  fiscalYear: string,
): RowResult[] {
  return Object.entries(computedByRow).map(([row, computed]) => {
    const expected = fixture.rows[row][fiscalYear];
    const diff = Math.abs(computed - expected);
    const diffPct = expected === 0 ? (computed === 0 ? 0 : Infinity) : diff / Math.abs(expected);
    return { row, computed, expected, diffPct, status: classify(diff, expected, row) };
  });
}

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
