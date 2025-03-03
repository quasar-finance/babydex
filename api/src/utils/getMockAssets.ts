import { Asset } from '../../@chain-registry/assetlist';
import baseAssets from '~/utils/base_assets_for_testing.json';

export const getBaseAssetByDenom = (denom: string): Asset | null => {
  let found;
  for (const asset of baseAssets.assets) {
    found = asset.denom_units.find(item => item.denom === denom);
    if (found) return asset as Asset;
  }
  return null;
};


