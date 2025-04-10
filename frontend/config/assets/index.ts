import { isMainnet } from "~/utils/global";
import { BabylonMainnetAssets } from "./babylon/mainnet";
import { BabylonTestnetAssets } from "./babylon/testnet";

export const Assets = isMainnet
  ? {
      ...BabylonMainnetAssets,
    }
  : {
      ...BabylonTestnetAssets,
    };
