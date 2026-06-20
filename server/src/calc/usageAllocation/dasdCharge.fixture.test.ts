import { describe, it } from 'vitest';
import { parseDasdUsageCsv } from '../../parsers/dasdUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computeDasdCharge } from './dasdCharge.js';

const STORAGE_CHARGE_POOL_202627 = 606513.3602839719;

describe('MF Fixed 26-27 DASD Storage Charge fixture checkpoint', () => {
  it('computes per-agency DASD storage charge (share of pool, no rounding) against the workbook\'s stored 2026-27 values', () => {
    const fixture = loadFixture('mfFixedDasdCharge.json');

    const usage = parseDasdUsageCsv(readFixtureCsv('rawInputs/DASD.csv'));

    // Rows present in the raw DASD usage extract but with no matching billing row in
    // MF Fixed 26-27 (excluded from the comparison; they still count toward the
    // shared totalGb denominator inside computeDasdCharge, which is unaffected here):
    // - 'ARCHIVE IN PROGRESS': unallocated storage, never billed to anyone.
    // - 'DIPL INFRASTRUCTURE PLANNING AND LOGISTICS': DASD tags this agency's usage
    //   under its old (pre-rename) name. MF Fixed's own AGENCY/historical-name columns
    //   (0-7) confirm this is the same row billed as 'DEPARTMENT OF LANDS PLANNING AND
    //   THE ENVIRONMENT' under its current name - and that billing row is $0 regardless.
    // - 'DEPARTMENT OF LANDS  PLANNING AND THE ENVIRONMENT' (double space) and
    //   'DEPT OF PEOPLE, SPORT & CULTUR' (comma): punctuation/whitespace variants of
    //   the above and of 'DEPT OF PEOPLE  SPORT & CULTUR' respectively; both billing
    //   rows are also $0 in the fixture, so the mismatch has no effect on charges.
    const NO_FIXTURE_COUNTERPART = [
      'ARCHIVE IN PROGRESS',
      'DIPL INFRASTRUCTURE PLANNING AND LOGISTICS',
      'DEPARTMENT OF LANDS  PLANNING AND THE ENVIRONMENT',
      'DEPT OF PEOPLE, SPORT & CULTUR',
    ];
    const computedByRow = Object.fromEntries(
      Object.entries(computeDasdCharge(usage, STORAGE_CHARGE_POOL_202627)).filter(
        ([agency]) => !NO_FIXTURE_COUNTERPART.includes(agency),
      ),
    );

    const results = compareToFixture(computedByRow, fixture, 'Total');
    reportAndAssertResults(fixture.sheetName, results);
  });
});
