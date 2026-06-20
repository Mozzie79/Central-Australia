import type { FixedAssetRow } from '@dcs/shared';

// Fiscal years run 1 July - 30 June.
const FISCAL_YEAR_START: Record<'fy202526' | 'fy202627', string> = {
  fy202526: '2025-07-01',
  fy202627: '2026-07-01',
};

// Straight-line: monthly depreciation = cost basis / estimated life in months. A small
// number of assets have a corrected life in the workbook's "Depreciation" sheet that
// differs from the raw extract's own EST LIFE YYY/MM (a manual data-quality fix), hence
// the optional override. Zero once accumulated depreciation has reached cost basis.
// The asset's final depreciation month is EOMONTH(acquisition date, life months - 1)
// (confirmed against the workbook's own "End Date" column); if that falls before the
// target fiscal year starts, depreciation is $0 for that year. If it falls partway
// through the target fiscal year, only the months up to and including that month count
// (confirmed against the workbook's own per-asset fiscal-year depreciation columns) -
// not a full 12 months.
export function annualDepreciation(
  asset: FixedAssetRow,
  fiscalYear: 'fy202526' | 'fy202627',
  lifeMonthsOverride?: number,
): number {
  if (asset.accumDepn >= asset.costBasis) {
    return 0;
  }
  const lifeMonths = lifeMonthsOverride ?? asset.estLifeYears * 12;
  if (!lifeMonths) return 0;

  const acqDate = new Date(`${asset.acqDate}T00:00:00Z`);
  const depreciationEnd = new Date(
    Date.UTC(acqDate.getUTCFullYear(), acqDate.getUTCMonth() + lifeMonths, 0),
  );
  const fyStart = new Date(`${FISCAL_YEAR_START[fiscalYear]}T00:00:00Z`);
  if (depreciationEnd <= fyStart) {
    return 0;
  }

  const monthsInFy =
    (depreciationEnd.getUTCFullYear() - fyStart.getUTCFullYear()) * 12 +
    (depreciationEnd.getUTCMonth() - fyStart.getUTCMonth()) +
    1;

  return (asset.costBasis / lifeMonths) * Math.min(12, monthsInFy);
}
