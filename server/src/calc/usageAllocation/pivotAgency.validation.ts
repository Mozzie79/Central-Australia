import type { SheetValidation } from '@dcs/shared';
import { parseMainframeUsageCsv } from '../../parsers/mainframeUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv } from '../costBuildUp/fixtureTestHelpers.js';
import { computePivotAgency } from './pivotAgency.js';

export function runPivotAgencyValidation(): SheetValidation {
  const fixture = loadFixture('pivotAgency.json');

  const usage = parseMainframeUsageCsv(readFixtureCsv('rawInputs/MainframeUsage.csv'));

  const byAgency = computePivotAgency(usage);
  const computedByRow: Record<string, number> = { ...byAgency };
  computedByRow['Grand Total'] = Object.values(byAgency).reduce((sum, v) => sum + v, 0);

  const results = compareToFixture(computedByRow, fixture, 'Total');
  return { sheetName: fixture.sheetName, results };
}

