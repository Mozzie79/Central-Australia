import { describe, it } from 'vitest';
import { parseMainframeUsageCsv } from '../../parsers/mainframeUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computePivotAgency } from '../usageAllocation/pivotAgency.js';
import { computeProductRevenue } from './productRevenue.js';

const PRODUCTS = ['Application Services', 'BASE', 'DB2', 'EGL', 'VMWare', 'Windows OS', 'RedHat OS', 'Disk Fixed File', 'Disk Variable'];

describe('Phase 7 Revenue fixture checkpoint', () => {
  it('computes per-product 2026-27 revenue against the workbook\'s stored values', () => {
    const fixture = loadFixture('productRevenue.json');

    const usage = parseMainframeUsageCsv(readFixtureCsv('rawInputs/MainframeUsage.csv'));
    const usageByAgency = computePivotAgency(usage);

    const computedByRow: Record<string, number> = {};
    for (const product of PRODUCTS) {
      const revenue = computeProductRevenue(product, usageByAgency);
      if (revenue === null) throw new Error(`Expected a confirmed revenue calculation for ${product}`);
      computedByRow[product] = revenue;
    }

    const results = compareToFixture(computedByRow, fixture, '2026-27');
    reportAndAssertResults(fixture.sheetName, results);
  });

  it('returns null for products with no identified usage-volume + rate pairing', () => {
    const revenue = computeProductRevenue('Operations', {});
    if (revenue !== null) throw new Error('Expected Operations to have no confirmed revenue calculation');
  });
});
