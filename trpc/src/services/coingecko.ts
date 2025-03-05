import ky from "ky";

import type { Cache } from "@towerfi/types";

export type CreateCoingeckoParameters = {
  cacheService: Cache;
};

export type CoingeckoServiceReturnType = {
  ping: () => Promise<boolean>;
  getPrice: (coinId: string) => Promise<number>;
};

export function createCoingeckoService(
  params: CreateCoingeckoParameters
): CoingeckoServiceReturnType {
  const { cacheService } = params;
  const api = ky.extend({ prefixUrl: "https://api.coingecko.com/api/v3" });

  async function ping(): Promise<boolean> {
    const { status } = await api.get("/ping");
    return status === 200;
  }

  async function getPrice(coinId: string): Promise<number> {
    try {
      const cachedValue = await cacheService.getItem<number>(coinId);
      if (cachedValue) return cachedValue;
      const { usd } = await api
        .get(`/simple/price?ids=${coinId}&vs_currencies=usd`)
        .json<{ usd: number }>();
      await cacheService.setItem(coinId, usd);
      return usd;
    } catch (err) {
      return 0;
    }
  }

  return {
    ping,
    getPrice,
  };
}
