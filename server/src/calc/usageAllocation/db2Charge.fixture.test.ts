import { describe, it } from 'vitest';
import { DB2_DATABASE_COUNT } from '../../config/index.js';
import { compareToFixture, loadFixture, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computeDb2Charge } from './db2Charge.js';

const DB2_CHARGE_POOL_202627 = 1062584.1368387293;

describe('MF Fixed 26-27 DB2/QMF Charge fixture checkpoint', () => {
  it('computes per-agency DB2/QMF charge (rounded share of pool) against the workbook\'s stored 2026-27 values', () => {
    const fixture = loadFixture('mfFixedDb2Charge.json');

    const computedByRow = computeDb2Charge(DB2_DATABASE_COUNT, DB2_CHARGE_POOL_202627);

    const results = compareToFixture(computedByRow, fixture, 'Total');
    reportAndAssertResults(fixture.sheetName, results);
  });
});
