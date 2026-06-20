import type { FixedAssetRow } from '@dcs/shared';

// Fiscal years run 1 July - 30 June.
const FISCAL_YEAR_START: Record<'fy202526' | 'fy202627', string> = {
  fy202526: '2025-07-01',
  fy202627: '2026-07-01',
};

// Straight-line: annual depreciation = cost basis / estimated life in months x 12.
// A small number of assets have a corrected life in the workbook's "Depreciation" sheet
// that differs from the raw extract's own EST LIFE YYY/MM (a manual data-quality fix),
// hence the optional override. Zero once accumulated depreciation has reached cost basis,
// or once the asset's life (acquisition date + life) ends before the target fiscal year
// starts - the as-of accumulated depreciation in the extract can lag behind that, since
// it's snapshotted at the extract's own run date, not the target fiscal year's start.
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

  const depreciationEnd = new Date(`${asset.acqDate}T00:00:00Z`);
  depreciationEnd.setUTCMonth(depreciationEnd.getUTCMonth() + lifeMonths);
  if (depreciationEnd <= new Date(`${FISCAL_YEAR_START[fiscalYear]}T00:00:00Z`)) {
    return 0;
  }

  return (asset.costBasis / lifeMonths) * 12;
}
