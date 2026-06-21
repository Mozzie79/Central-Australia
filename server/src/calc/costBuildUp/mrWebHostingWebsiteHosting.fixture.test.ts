import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrWebHostingWebsiteHostingValidation } from './mrWebHostingWebsiteHosting.validation.js';

describe('MR Web Hosting - Website Hosting Services Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrWebHostingWebsiteHostingValidation();
    reportAndAssertResults(sheetName, results);
  });
});
