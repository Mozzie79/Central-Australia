import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMfStorageValidation } from './mfStorage.validation.js';

describe('MF Storage Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMfStorageValidation();
    reportAndAssertResults(sheetName, results);
  });
});
