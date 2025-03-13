import type { AssetInfo } from "@towerfi/types";

export function getInnerValueFromAsset(asset: AssetInfo): string {
  if ("token" in asset) {
    return asset.token.contract_addr;
  }
  return asset.native_token.denom;
}
