import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ASSET_LIFE_MONTHS_OVERRIDE,
  ASSET_PRODUCT_MAP,
  CONTRACTOR_ALLOCATIONS,
  MAINFRAME_FAMILY,
  PLANNED_ASSET_ADDITIONS,
} from '../../config/index.js';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { computeAssets } from './assets.js';
import { computeContractorStaffCosts } from './contractorStaffCosts.js';
import { computePayrollStaffCosts } from './payrollStaffCosts.js';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');

const PRODUCT = 'BASE';

type RowResult = {
  row: string;
  computed: number;
  expected: number;
  diffPct: number;
  status: 'matched' | 'approximate' | 'flagged';
};

function classify(diffPct: number): RowResult['status'] {
  if (diffPct <= 0.001) return 'matched';
  if (diffPct <= 0.01) return 'approximate';
  return 'flagged';
}

describe('MF BASE Phase 3 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor rows against the workbook\'s stored 2026-27 values', () => {
    const mfBaseFixture = JSON.parse(
      readFileSync(path.join(FIXTURES_DIR, 'mfBase.json'), 'utf-8'),
    ) as { rows: Record<string, Record<string, number>> };

    const fixedAssets = parseFixedAssetsCsv(
      readFileSync(path.join(FIXTURES_DIR, 'rawInputs/FixedAssets.csv'), 'utf-8'),
    );
    const employeeExpense = parseEmployeeExpenseCsv(
      readFileSync(path.join(FIXTURES_DIR, 'rawInputs/Employee_Expense.csv'), 'utf-8'),
    );
    const contractorActuals = parseContractorActualCsv(
      readFileSync(path.join(FIXTURES_DIR, 'rawInputs/Contractor_Actual.csv'), 'utf-8'),
    );

    const computedByRow: Record<string, number> = {
      Assets: computeAssets(
        fixedAssets,
        ASSET_PRODUCT_MAP,
        ASSET_LIFE_MONTHS_OVERRIDE,
        PLANNED_ASSET_ADDITIONS,
        PRODUCT,
        'fy202627',
      ),
      'Payroll Staff Costs': computePayrollStaffCosts(employeeExpense, MAINFRAME_FAMILY, PRODUCT),
      'Contractor Staff Costs': computeContractorStaffCosts(
        contractorActuals,
        CONTRACTOR_ALLOCATIONS,
        PRODUCT,
      ),
    };

    const results: RowResult[] = Object.entries(computedByRow).map(([row, computed]) => {
      const expected = mfBaseFixture.rows[row]['2026-27'];
      const diffPct = Math.abs(computed - expected) / expected;
      return { row, computed, expected, diffPct, status: classify(diffPct) };
    });

    console.table(
      results.map((r) => ({
        row: r.row,
        computed: r.computed.toFixed(2),
        expected: r.expected.toFixed(2),
        diffPct: (r.diffPct * 100).toFixed(2) + '%',
        status: r.status,
      })),
    );

    for (const r of results) {
      expect(r.status, `${r.row} diff of ${(r.diffPct * 100).toFixed(2)}% is flagged`).not.toBe(
        'flagged',
      );
    }
  });
});
