import { describe, it } from 'vitest';
import { parseContractorActualCsv } from '../../parsers/contractorActual.js';
import { parseEmployeeExpenseCsv } from '../../parsers/employeeExpense.js';
import { parseFixedAssetsCsv } from '../../parsers/fixedAssets.js';
import { readFixtureCsv } from '../costBuildUp/fixtureTestHelpers.js';
import { reportAndAssertResults } from '../costBuildUp/reportAndAssertResults.js';
import { computeFamilyRollup } from './familyRollup.js';
import { loadFamilyRollupFixture, runFamilyRollupValidations } from './familyRollup.validation.js';

describe('DCS Summary family rollup fixture checkpoint', () => {
  const fixture = loadFamilyRollupFixture();

  const fixedAssets = parseFixedAssetsCsv(readFixtureCsv('rawInputs/FixedAssets.csv'));
  const employeeExpense = parseEmployeeExpenseCsv(readFixtureCsv('rawInputs/Employee_Expense.csv'));
  const contractorActuals = parseContractorActualCsv(readFixtureCsv('rawInputs/Contractor_Actual.csv'));

  const computedFamilies = computeFamilyRollup(fixedAssets, employeeExpense, contractorActuals, 'fy202627');
  const familyNames = Object.keys(computedFamilies);
  const validations = runFamilyRollupValidations();

  familyNames.forEach((familyName, index) => {
    it(`computes ${familyName} rows against the workbook's stored DCS Summary 2026-27 values`, () => {
      const { sheetName, results } = validations[index];
      reportAndAssertResults(sheetName, results);
    });
  });
});
