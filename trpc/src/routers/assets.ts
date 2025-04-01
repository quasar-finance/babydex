import { createCallerFactory, createTRPCPublicProcedure, createTRPCRouter } from "../config.js";
import { z } from "zod";

import type { BaseCurrency, NativeCurrency, CW20Currency, WithPrice } from "@towerfi/types";
import { appRouter } from "../router.js";

export const assetsRouter = createTRPCRouter({
  getAsset: createTRPCPublicProcedure
    .input(z.object({ asset: z.string() }))
    .query<WithPrice<BaseCurrency>>(async ({ input, ctx }) => {
      const { asset: denomOrAddress } = input;
      const { assets, publicClient, cacheService, coingeckoService } = ctx;
      const asset =
        assets[denomOrAddress] ||
        Object.values(assets).find(
          (asset) => (asset as CW20Currency).contractAddress === denomOrAddress,
        );

      const price = await (async () => {
        if (!asset?.coingeckoId) return 0;
        return await coingeckoService.getPrice(asset.coingeckoId);
      })();

      if (asset) return { ...asset, price };

      const cachedAsset = await cacheService.getItem<WithPrice<NativeCurrency>>(denomOrAddress);
      if (cachedAsset) return cachedAsset;

      const { metadata } = await publicClient
        .queryDenomMetadata({ denom: denomOrAddress })
        .catch(() => ({
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
        denom: denomOrAddress,
        logoURI: "/assets/default.png",
        price: 0,
      };

      await cacheService.setItem(denomOrAddress, unknownAsset);
      return unknownAsset;
    }),

  getAssets: createTRPCPublicProcedure
    .input(z.object({ assets: z.array(z.string()) }))
    .query<WithPrice<BaseCurrency>[]>(async ({ ctx, input }) => {
      const caller = createCallerFactory(appRouter)(ctx);
      const responses: WithPrice<BaseCurrency>[] = await Promise.all(
        input.assets.map((asset) => caller.local.assets.getAsset({ asset })),
      );
      return responses;
    }),
});
