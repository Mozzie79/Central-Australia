import type { FixedAssetRow } from '@dcs/shared';

// Straight-line hypothesis: annual depreciation = current monthly depreciation x 12,
// using the extract's own CURR DEPN as the run-rate for the fiscal year. Zero once
// accumulated depreciation has reached cost basis (fully depreciated).
export function annualDepreciation(asset: FixedAssetRow): number {
  if (asset.accumDepn >= asset.costBasis) {
    return 0;
  }
  return asset.currDepn * 12;
}

export function totalAnnualDepreciation(assets: FixedAssetRow[], costCentre: string): number {
  return assets
    .filter((a) => a.costCentre === costCentre)
    .reduce((sum, a) => sum + annualDepreciation(a), 0);
}
