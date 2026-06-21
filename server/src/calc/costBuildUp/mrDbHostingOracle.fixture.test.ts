import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrDbHostingOracleValidation } from './mrDbHostingOracle.validation.js';

describe('MR DB Hosting - Oracle Database Hosting Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrDbHostingOracleValidation();
    reportAndAssertResults(sheetName, results);
  });
});
