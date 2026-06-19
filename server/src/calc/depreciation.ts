import type { FixedAssetRow } from '@dcs/shared';

// Straight-line: annual depreciation = cost basis / estimated life in months x 12.
// A small number of assets have a corrected life in the workbook's "Depreciation" sheet
// that differs from the raw extract's own EST LIFE YYY/MM (a manual data-quality fix),
// hence the optional override. Zero once accumulated depreciation has reached cost basis.
export function annualDepreciation(asset: FixedAssetRow, lifeMonthsOverride?: number): number {
  if (asset.accumDepn >= asset.costBasis) {
    return 0;
  }
  const lifeMonths = lifeMonthsOverride ?? asset.estLifeYears * 12;
  if (!lifeMonths) return 0;
  return (asset.costBasis / lifeMonths) * 12;
}
