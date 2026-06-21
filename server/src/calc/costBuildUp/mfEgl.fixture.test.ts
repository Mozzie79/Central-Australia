import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMfEglValidation } from './mfEgl.validation.js';

describe('MF EGL Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMfEglValidation();
    reportAndAssertResults(sheetName, results);
  });
});
