import type { SheetValidation } from '@dcs/shared';
import { DB2_DATABASE_COUNT } from '../../config/index.js';
import { compareToFixture, loadFixture } from '../costBuildUp/fixtureTestHelpers.js';
import { computeDb2Charge } from './db2Charge.js';

const DB2_CHARGE_POOL_202627 = 1062584.1368387293;

export function runDb2ChargeValidation(): SheetValidation {
  const fixture = loadFixture('mfFixedDb2Charge.json');

  const computedByRow = computeDb2Charge(DB2_DATABASE_COUNT, DB2_CHARGE_POOL_202627);

  const results = compareToFixture(computedByRow, fixture, 'Total');
  return { sheetName: fixture.sheetName, results };
}

