import type { SheetValidation } from '@dcs/shared';
import { EGL_APPLICATION_COUNT } from '../../config/index.js';
import { compareToFixture, loadFixture } from '../costBuildUp/fixtureTestHelpers.js';
import { computeEglCharge } from './eglCharge.js';

const EGL_CHARGE_POOL_202627 = 488864.443038655;

export function runEglChargeValidation(): SheetValidation {
  const fixture = loadFixture('mfFixedEglCharge.json');

  const computedByRow = computeEglCharge(EGL_APPLICATION_COUNT, EGL_CHARGE_POOL_202627);

  const results = compareToFixture(computedByRow, fixture, 'Total');
  return { sheetName: fixture.sheetName, results };
}

