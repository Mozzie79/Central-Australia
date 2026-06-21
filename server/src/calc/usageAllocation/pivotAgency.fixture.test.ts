import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { runPivotAgencyValidation } from './pivotAgency.validation.js';

describe('Pivot Agency 25-26 fixture checkpoint', () => {
  it('computes Sum of CPU Secs grouped by Agency against the workbook\'s stored pivot table values', () => {
    const { sheetName, results } = runPivotAgencyValidation();
    reportAndAssertResults(sheetName, results);
  });
});
