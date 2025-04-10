import { BabylonMainnetAssets } from "./babylon/mainnet";
import { BabylonTestnetAssets } from "./babylon/testnet";

export const Assets =
  process.env.NODE_ENV === "production"
    ? {
        ...BabylonMainnetAssets,
      }
    : {
        ...BabylonTestnetAssets,
      };
