import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { runDb2ChargeValidation } from './db2Charge.validation.js';

describe('MF Fixed 26-27 DB2/QMF Charge fixture checkpoint', () => {
  it('computes per-agency DB2/QMF charge (rounded share of pool) against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runDb2ChargeValidation();
    reportAndAssertResults(sheetName, results);
  });
});
