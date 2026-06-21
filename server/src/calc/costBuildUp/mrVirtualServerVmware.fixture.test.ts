import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrVirtualServerVmwareValidation } from './mrVirtualServerVmware.validation.js';

describe('MR Virtual Server - VMWare Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrVirtualServerVmwareValidation();
    reportAndAssertResults(sheetName, results);
  });
});
