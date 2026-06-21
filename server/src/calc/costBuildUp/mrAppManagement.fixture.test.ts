import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrAppManagementValidation } from './mrAppManagement.validation.js';

describe('MR App Management Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrAppManagementValidation();
    reportAndAssertResults(sheetName, results);
  });
});
