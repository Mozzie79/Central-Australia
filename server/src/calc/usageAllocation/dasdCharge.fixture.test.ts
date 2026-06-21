import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { runDasdChargeValidation } from './dasdCharge.validation.js';

describe('MF Fixed 26-27 DASD Storage Charge fixture checkpoint', () => {
  it('computes per-agency DASD storage charge (share of pool, no rounding) against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runDasdChargeValidation();
    reportAndAssertResults(sheetName, results);
  });
});
