import { describe, it } from 'vitest';
import { EGL_APPLICATION_COUNT } from '../../config/index.js';
import { compareToFixture, loadFixture, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computeEglCharge } from './eglCharge.js';

const EGL_CHARGE_POOL_202627 = 488864.443038655;

describe('MF Fixed 26-27 EGL Charge fixture checkpoint', () => {
  it('computes per-agency EGL charge (rounded share of pool) against the workbook\'s stored 2026-27 values', () => {
    const fixture = loadFixture('mfFixedEglCharge.json');

    const computedByRow = computeEglCharge(EGL_APPLICATION_COUNT, EGL_CHARGE_POOL_202627);

    const results = compareToFixture(computedByRow, fixture, 'Total');
    reportAndAssertResults(fixture.sheetName, results);
  });
});
