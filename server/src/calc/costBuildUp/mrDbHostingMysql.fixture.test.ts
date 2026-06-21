import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrDbHostingMysqlValidation } from './mrDbHostingMysql.validation.js';

describe('MR DB Hosting - MySQL Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrDbHostingMysqlValidation();
    reportAndAssertResults(sheetName, results);
  });
});
