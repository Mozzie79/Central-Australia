import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runMrDbHostingNotesValidation } from './mrDbHostingNotes.validation.js';

describe('MR DB Hosting - Domino / Lotus Notes Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runMrDbHostingNotesValidation();
    reportAndAssertResults(sheetName, results);
  });
});
