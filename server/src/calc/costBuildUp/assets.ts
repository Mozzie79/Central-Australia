import type { FixedAssetRow } from '@dcs/shared';
import { annualDepreciation } from '../depreciation.js';
import type { PlannedAssetAddition } from '../../config/plannedAssetAdditions.js';

// "Assets" = depreciation of existing assets tagged to this product (via the static
// ASSET_PRODUCT_MAP, since a cost centre like Mainframe's '1011' mixes BASE and STORAGE
// assets) plus any budgeted future capital purchases for the forecast year.
export function computeAssets(
  assets: FixedAssetRow[],
  assetProductMap: Record<string, string>,
  assetLifeMonthsOverride: Record<string, number>,
  plannedAdditions: PlannedAssetAddition[],
  product: string,
  fiscalYear: 'fy202526' | 'fy202627',
): number {
  const existing = assets
    .filter((a) => assetProductMap[a.assetNo] === product)
    .reduce((sum, a) => sum + annualDepreciation(a, assetLifeMonthsOverride[a.assetNo]), 0);

  const planned = plannedAdditions
    .filter((p) => p.product === product)
    .reduce((sum, p) => sum + p[fiscalYear], 0);

  return existing + planned;
}
