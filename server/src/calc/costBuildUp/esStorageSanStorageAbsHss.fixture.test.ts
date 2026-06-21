import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runEsStorageSanStorageAbsHssValidation } from './esStorageSanStorageAbsHss.validation.js';

describe('ES Storage - SAN Storage ABS-HSS Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runEsStorageSanStorageAbsHssValidation();
    reportAndAssertResults(sheetName, results);
  });
});
