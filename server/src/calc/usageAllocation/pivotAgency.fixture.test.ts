import { describe, it } from 'vitest';
import { parseMainframeUsageCsv } from '../../parsers/mainframeUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computePivotAgency } from './pivotAgency.js';

describe('Pivot Agency 25-26 fixture checkpoint', () => {
  it('computes Sum of CPU Secs grouped by Agency against the workbook\'s stored pivot table values', () => {
    const fixture = loadFixture('pivotAgency.json');

    const usage = parseMainframeUsageCsv(readFixtureCsv('rawInputs/MainframeUsage.csv'));

    const byAgency = computePivotAgency(usage);
    const computedByRow: Record<string, number> = { ...byAgency };
    computedByRow['Grand Total'] = Object.values(byAgency).reduce((sum, v) => sum + v, 0);

    const results = compareToFixture(computedByRow, fixture, 'Total');
    reportAndAssertResults(fixture.sheetName, results);
  });
});
