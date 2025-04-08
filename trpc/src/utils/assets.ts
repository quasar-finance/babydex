import type { AssetInfo, Currency } from "@towerfi/types";

export function getInnerValueFromAsset(asset: AssetInfo): { type: string; denom: string } {
  if ("token" in asset) {
    return { type: "cw20", denom: asset.token.contract_addr };
  }
  return { type: "native", denom: asset.native_token.denom };
}

export function setInnerValueToAsset(asset: Currency): AssetInfo {
  if (asset.type === "cw-20") {
    return { token: { contract_addr: asset.denom } };
  }
  return { native_token: { denom: asset.denom } };
}
