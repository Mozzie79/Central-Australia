import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrVirtualServerWindowsOsValidation } from './mrVirtualServerWindowsOs.validation.js';

describe('MR Virtual Server - Windows OS Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrVirtualServerWindowsOsValidation();
    reportAndAssertResults(sheetName, results);
  });
});
