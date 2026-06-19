import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'vitest';
import { CONTRACTOR_ALLOCATIONS, MAINFRAME_FAMILY } from '../../config/index.js';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { computeAssets } from './assets.js';
import { computeContractorStaffCosts } from './contractorStaffCosts.js';
import { computePayrollStaffCosts } from './payrollStaffCosts.js';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');

// Fixed Assets uses short cost-centre codes ("1011"); Employee Expense and the
// Overhead config use the full code ("661011") for the same Mainframe cost centre.
const MF_BASE_ASSET_COST_CENTRE = '1011';
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
      Assets: computeAssets(fixedAssets, MF_BASE_ASSET_COST_CENTRE),
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
  });
});
