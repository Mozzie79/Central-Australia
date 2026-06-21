import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runServerHostingBdcValidation } from './serverHostingBdc.validation.js';

describe('Server Hosting BDC Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead / BDC Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runServerHostingBdcValidation();
    reportAndAssertResults(sheetName, results);
  });
});
