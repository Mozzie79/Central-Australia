import type { SheetValidation } from '@dcs/shared';
import { parseMainframeUsageCsv } from '../../parsers/mainframeUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv } from '../costBuildUp/fixtureTestHelpers.js';
import { computePivotAgency } from '../usageAllocation/pivotAgency.js';
import { computeProductRevenue } from './productRevenue.js';

const PRODUCTS = ['Application Services', 'BASE', 'DB2', 'EGL', 'VMWare', 'Windows OS', 'RedHat OS', 'Disk Fixed File', 'Disk Variable'];

export function runProductRevenueValidation(): SheetValidation {
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
  return { sheetName: fixture.sheetName, results };
}
