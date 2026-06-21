import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrWebHostingSharepointValidation } from './mrWebHostingSharepoint.validation.js';

describe('MR Web Hosting - Sharepoint Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrWebHostingSharepointValidation();
    reportAndAssertResults(sheetName, results);
  });
});
