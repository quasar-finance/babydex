import { AssetList, Asset } from '../../@chain-registry/assetlist';
import baseAssets from '~/utils/base_assets_for_testing.json';

export const getBaseAsset = (address: string) => {
  return baseAssets.assets.find(
    (asset) => asset.address?.toLowerCase() === address || asset.base.toLowerCase() === address) as Asset;
};

export const getBaseAssetByDenom  = (denom: string): Asset | undefined => {
  let found;
  for ( const asset of baseAssets.assets ){
    found = asset.denom_units.find( item => item.denom == denom )
    if ( found ) return asset as Asset;
  }
  return undefined;
};

export const getAllBaseAssets = () => {
  return baseAssets as AssetList
}


