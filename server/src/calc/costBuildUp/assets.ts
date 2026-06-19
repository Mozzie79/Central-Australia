import type { FixedAssetRow } from '@dcs/shared';
import { totalAnnualDepreciation } from '../depreciation.js';

export function computeAssets(assets: FixedAssetRow[], costCentre: string): number {
  return totalAnnualDepreciation(assets, costCentre);
}
