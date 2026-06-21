import type { SheetValidation } from '@dcs/shared';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { compareToFixture, readFixtureCsv, FIXTURES_DIR } from '../costBuildUp/fixtureTestHelpers.js';
import { computeFamilyRollup } from './familyRollup.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// DCS Summary's family-rollup columns (1-7 of the wide cross-tab) restate exact
// column-sums over groups of already-fixture-tested per-product columns. This is
// an integration cross-check, not new calculation logic.
type FamilyRollupFixture = {
  sheetName: string;
  source: string;
  families: Record<string, Record<string, Record<string, number>>>;
};

export function loadFamilyRollupFixture(): FamilyRollupFixture {
  return JSON.parse(readFileSync(path.join(FIXTURES_DIR, 'familyRollup.json'), 'utf-8')) as FamilyRollupFixture;
}

export function runFamilyRollupValidations(): SheetValidation[] {
  const fixture = loadFamilyRollupFixture();

  const fixedAssets = parseFixedAssetsCsv(readFixtureCsv('rawInputs/FixedAssets.csv'));
  const employeeExpense = parseEmployeeExpenseCsv(readFixtureCsv('rawInputs/Employee_Expense.csv'));
  const contractorActuals = parseContractorActualCsv(readFixtureCsv('rawInputs/Contractor_Actual.csv'));

  const computedFamilies = computeFamilyRollup(fixedAssets, employeeExpense, contractorActuals, 'fy202627');

  return Object.entries(computedFamilies).map(([familyName, computedByRow]) => {
    const results = compareToFixture(computedByRow, { ...fixture, rows: fixture.families[familyName] }, '2026-27');
    return { sheetName: `${fixture.sheetName} (${familyName})`, results };
  });
}
