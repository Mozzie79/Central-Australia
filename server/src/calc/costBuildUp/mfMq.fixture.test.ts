import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMfMqValidation } from './mfMq.validation.js';

describe('MF MQ Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows as all-zero against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMfMqValidation();
    reportAndAssertResults(sheetName, results);
  });
});
