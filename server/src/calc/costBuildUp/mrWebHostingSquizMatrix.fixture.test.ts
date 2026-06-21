import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrWebHostingSquizMatrixValidation } from './mrWebHostingSquizMatrix.validation.js';

describe('MR Web Hosting - Squiz Matrix Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrWebHostingSquizMatrixValidation();
    reportAndAssertResults(sheetName, results);
  });
});
