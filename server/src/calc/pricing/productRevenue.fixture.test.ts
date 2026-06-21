import { describe, it } from 'vitest';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { computeProductRevenue } from './productRevenue.js';
import { runProductRevenueValidation } from './productRevenue.validation.js';

describe('Phase 7 Revenue fixture checkpoint', () => {
  it('computes per-product 2026-27 revenue against the workbook\'s stored values', () => {
    const { sheetName, results } = runProductRevenueValidation();
    reportAndAssertResults(sheetName, results);
  });

  it('returns null for products with no identified usage-volume + rate pairing', () => {
    const revenue = computeProductRevenue('Operations', {});
    if (revenue !== null) throw new Error('Expected Operations to have no confirmed revenue calculation');
  });
});
