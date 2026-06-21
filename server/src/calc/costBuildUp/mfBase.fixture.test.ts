import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMfBaseValidation } from './mfBase.validation.js';

describe('MF BASE Phase 3 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMfBaseValidation();
    reportAndAssertResults(sheetName, results);
  });
});
