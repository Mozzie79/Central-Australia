import type { RowResult } from '@dcs/shared';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');

export type FixtureFile = {
  sheetName: string;
  source: string;
  rows: Record<string, Record<string, number>>;
};

export type { RowResult };

// Tolerance is "within 1% or $5, whichever is larger" (per the plan's proposed threshold).
// For an expected value of exactly 0, percentage diff is undefined, so fall back to the
// flat $5 absolute tolerance.
function classify(diff: number, expected: number): RowResult['status'] {
  const tolerancePct = 0.01;
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
    return { row, computed, expected, diffPct, status: classify(diff, expected) };
  });
}

