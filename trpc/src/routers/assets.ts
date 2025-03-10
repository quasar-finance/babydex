import { createTRPCPublicProcedure, createTRPCRouter } from "../config.js";
import { z } from "zod";

import type { BaseCurrency, NativeCurrency, WithPrice } from "@towerfi/types";

export const assetsRouter = createTRPCRouter({
  getAsset: createTRPCPublicProcedure
    .input(z.object({ denom: z.string() }))
    .query<WithPrice<BaseCurrency>>(async ({ input, ctx }) => {
      const { denom } = input;
      const { assets, publicClient, cacheService, coingeckoService } = ctx;
      const asset = assets[denom];

      const price = await (async () => {
        if (!asset?.coingeckoId) return 0;
        return await coingeckoService.getPrice(asset.coingeckoId);
      })();

      if (asset) return { ...asset, price };

      const cachedAsset = await cacheService.getItem<WithPrice<NativeCurrency>>(denom);
      if (cachedAsset) return cachedAsset;

      const { metadata } = await publicClient.queryDenomMetadata({ denom }).catch(() => ({
        metadata: {
          symbol: "UNKNOWN",
          denomUnits: [{ denom: "UNKNOWN", exponent: 0 }],
        },
      }));

      const symbol = metadata.symbol.split("/").at(-1) ?? "UNKNOWN";
      const decimals = metadata.denomUnits.at(0)?.exponent ?? 0;

      const unknownAsset = {
        symbol,
        decimals: 6 + decimals,
        denom,
        logoURI: "/assets/default.png",
        price: 0,
      };

      await cacheService.setItem(denom, unknownAsset);
      return unknownAsset;
    }),
});
