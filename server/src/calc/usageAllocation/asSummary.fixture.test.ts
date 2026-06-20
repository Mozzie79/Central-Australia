import { describe, it } from 'vitest';
import { parseAsDataCsv } from '../../parsers/asData.js';
import { compareToFixture, loadFixture, readFixtureCsv, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computeAsSummary } from './asSummary.js';

describe('AS Summary fixture checkpoint', () => {
  it('computes per-contractor Total/Billable/Non-Billable hours against the workbook\'s stored values', () => {
    const fixture = loadFixture('asSummary.json');

    const asData = parseAsDataCsv(readFixtureCsv('rawInputs/ASData.csv'));
    const summary = computeAsSummary(asData);

    // 'PARIAN  MILA', 'MCDONALD  COLIN' and 'DANS  GABRIEL' have real hours logged in
    // the raw AS data but were manually removed from AS Summary by the workbook's
    // author (a sheet annotation reads "Remove Colin as he is not continuing") -
    // excluded here since the fixture has no expected values for them.
    const REMOVED_FROM_MODEL = ['PARIAN  MILA', 'MCDONALD  COLIN', 'DANS  GABRIEL'];
    const included = Object.fromEntries(
      Object.entries(summary).filter(([name]) => !REMOVED_FROM_MODEL.includes(name)),
    );

    const totalHours = Object.fromEntries(Object.entries(included).map(([name, s]) => [name, s.totalHours]));
    const billable = Object.fromEntries(Object.entries(included).map(([name, s]) => [name, s.billable]));
    const nonBillable = Object.fromEntries(Object.entries(included).map(([name, s]) => [name, s.nonBillable]));

    const results = [
      ...compareToFixture(totalHours, fixture, 'Total Hours'),
      ...compareToFixture(billable, fixture, 'Billable'),
      ...compareToFixture(nonBillable, fixture, 'Non-Billable'),
    ];
    reportAndAssertResults(fixture.sheetName, results);
  });
});
