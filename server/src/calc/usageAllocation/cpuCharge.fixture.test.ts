import { describe, it } from 'vitest';
import { CPU_CHARGE_EXCLUDED_AGENCIES } from '../../config/index.js';
import { parseMainframeUsageCsv } from '../../parsers/mainframeUsage.js';
import { compareToFixture, loadFixture, readFixtureCsv, reportAndAssertResults } from '../costBuildUp/fixtureTestHelpers.js';
import { computeCpuCharge } from './cpuCharge.js';
import { computePivotAgency } from './pivotAgency.js';

const CPU_TOTAL_CHARGE_POOL_202627 = 9688255.852082567;

describe('MF Fixed 26-27 CPU Charge fixture checkpoint', () => {
  it('computes per-agency CPU charge (rounded share of pool) against the workbook\'s stored 2026-27 values', () => {
    const fixture = loadFixture('mfFixedCpuCharge.json');

    const usage = parseMainframeUsageCsv(readFixtureCsv('rawInputs/MainframeUsage.csv'));
    const usageByAgency = computePivotAgency(usage);

    const computedByRow = computeCpuCharge(usageByAgency, CPU_CHARGE_EXCLUDED_AGENCIES, CPU_TOTAL_CHARGE_POOL_202627);

    const results = compareToFixture(computedByRow, fixture, 'Total');
    reportAndAssertResults(fixture.sheetName, results);
  });
});
