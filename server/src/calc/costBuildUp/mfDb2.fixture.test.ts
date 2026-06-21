import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMfDb2Validation } from './mfDb2.validation.js';

describe('MF DB2 Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMfDb2Validation();
    reportAndAssertResults(sheetName, results);
  });
});
