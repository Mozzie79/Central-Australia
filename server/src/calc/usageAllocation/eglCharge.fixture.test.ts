import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { runEglChargeValidation } from './eglCharge.validation.js';

describe('MF Fixed 26-27 EGL Charge fixture checkpoint', () => {
  it('computes per-agency EGL charge (rounded share of pool) against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runEglChargeValidation();
    reportAndAssertResults(sheetName, results);
  });
});
