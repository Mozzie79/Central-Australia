import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { runAsSummaryValidation } from './asSummary.validation.js';

describe('AS Summary fixture checkpoint', () => {
  it('computes per-contractor Total/Billable/Non-Billable hours against the workbook\'s stored values', () => {
    const { sheetName, results } = runAsSummaryValidation();
    reportAndAssertResults(sheetName, results);
  });
});
