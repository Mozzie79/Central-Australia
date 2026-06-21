import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runServerHostingGdcValidation } from './serverHostingGdc.validation.js';

describe('Server Hosting GDC Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead / GDC Building Overheads rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runServerHostingGdcValidation();
    reportAndAssertResults(sheetName, results);
  });
});
