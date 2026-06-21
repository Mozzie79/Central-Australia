import { describe, it } from 'vitest';
import { reportAndAssertResults } from './reportAndAssertResults.js';
import { runEsBackupsBackupStorageValidation } from './esBackupsBackupStorage.validation.js';

describe('ES Backups - Backup Storage Phase 4 fixture checkpoint', () => {
  it('computes Assets / Payroll / Contractor / HR / Business Support Overhead / Corporate Staff Overhead rows against the workbook\'s stored 2026-27 values', () => {
    const { sheetName, results } = runEsBackupsBackupStorageValidation();
    reportAndAssertResults(sheetName, results);
  });
});
