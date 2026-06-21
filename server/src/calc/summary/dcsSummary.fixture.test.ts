import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { PRODUCT_CONFIGS, runDcsSummaryValidations } from './dcsSummary.validation.js';

describe('DCS Summary fixture checkpoint', () => {
  const validations = runDcsSummaryValidations();
  const fixtureProducts = Object.keys(PRODUCT_CONFIGS);

  fixtureProducts.forEach((fixtureProduct, index) => {
    it(`computes ${fixtureProduct} rows against the workbook's stored DCS Summary 2026-27 values`, () => {
      const { sheetName, results } = validations[index];
      reportAndAssertResults(sheetName, results);
    });
  });
});
