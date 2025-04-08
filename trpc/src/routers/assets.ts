import { createCallerFactory, createTRPCPublicProcedure, createTRPCRouter } from "../config.js";
import { z } from "zod";

import type { WithPrice, Currency, CW20Currency } from "@towerfi/types";
import { appRouter } from "../router.js";

export const assetsRouter = createTRPCRouter({
  getAsset: createTRPCPublicProcedure
    .input(z.object({ asset: z.string() }))
    .query<WithPrice<Currency>>(async ({ input, ctx }) => {
      const { asset: denomOrAddress } = input;
      const { assets, publicClient, cacheService, coingeckoService } = ctx;
      const cachedAsset = await cacheService.getItem<WithPrice<Currency>>(denomOrAddress);
      if (cachedAsset) return cachedAsset;

      const asset =
        assets[denomOrAddress] ||
        Object.values(assets).find(
          (asset) => (asset as CW20Currency).contractAddress === denomOrAddress,
        );

      const price = await (async () => {
        if (!asset?.coingeckoId) return 0;
        return await coingeckoService.getPrice(asset.coingeckoId);
      })();

      if (asset) {
        const assetWithPrice = { ...asset, price };
        await cacheService.setItem(denomOrAddress, assetWithPrice);
        return assetWithPrice;
      }

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
        type: "ibc",
        decimals: 6 + decimals,
        denom: denomOrAddress,
        logoURI: "/assets/default.png",
        price: 0,
      };

      await cacheService.setItem(denomOrAddress, unknownAsset);
      return unknownAsset as WithPrice<Currency>;
    }),

  getAssets: createTRPCPublicProcedure
    .input(z.object({ assets: z.array(z.string()) }))
    .query<WithPrice<Currency>[]>(async ({ ctx, input }) => {
      const caller = createCallerFactory(appRouter)(ctx);
      const responses: WithPrice<Currency>[] = await Promise.all(
        input.assets.map((asset) => caller.local.assets.getAsset({ asset })),
      );
      return responses;
    }),
});
