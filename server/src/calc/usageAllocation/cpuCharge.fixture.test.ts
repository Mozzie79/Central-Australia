import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { runCpuChargeValidation } from './cpuCharge.validation.js';

describe('MF Fixed 26-27 CPU Charge fixture checkpoint', () => {
  it('computes per-agency CPU charge (rounded share of pool) against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runCpuChargeValidation();
    reportAndAssertResults(sheetName, results);
  });
});
