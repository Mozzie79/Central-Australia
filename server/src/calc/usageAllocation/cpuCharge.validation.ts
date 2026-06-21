import type { SheetValidation } from '@dcs/shared';
import { CPU_CHARGE_EXCLUDED_AGENCIES } from '../../config/index.js';
import { parseMainframeUsageCsv } from '../../parsers/mainframeUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv } from '../costBuildUp/fixtureTestHelpers.js';
import { computeCpuCharge } from './cpuCharge.js';
import { computePivotAgency } from './pivotAgency.js';

const CPU_TOTAL_CHARGE_POOL_202627 = 9688255.852082567;

export function runCpuChargeValidation(): SheetValidation {
  const fixture = loadFixture('mfFixedCpuCharge.json');

  const usage = parseMainframeUsageCsv(readFixtureCsv('rawInputs/MainframeUsage.csv'));
  const usageByAgency = computePivotAgency(usage);

  const computedByRow = computeCpuCharge(usageByAgency, CPU_CHARGE_EXCLUDED_AGENCIES, CPU_TOTAL_CHARGE_POOL_202627);

  const results = compareToFixture(computedByRow, fixture, 'Total');
  return { sheetName: fixture.sheetName, results };
}

