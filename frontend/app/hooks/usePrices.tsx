"use client";

import { useQuery } from "@tanstack/react-query";
import { Assets } from "~/config";
import type { Currency } from "@towerfi/types";
import type { Prettify } from "cosmi/types";
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "~/utils/intl";
import { usePublicClient } from "@cosmi/react";
import { setInnerValueToAsset } from "@towerfi/trpc";
import type { UseSwapSimulationReturnType } from "./useSwapSimulation";

export type FormatNumberOptions = {
  language: string;
  currency?: string;
  style?: "decimal" | "percent" | "currency";
  notation?: "standard" | "scientific" | "engineering" | "compact";
  maxFractionDigits?: number;
  minFractionDigits?: number;
  useGrouping?: boolean;
};

export type Prices = Record<string, Prettify<Currency & { prices: Record<string, number> }>>;

export function formatNumber(_amount_: number | bigint | string, options: FormatNumberOptions) {
  const {
    language,
    currency,
    maxFractionDigits = 2,
    minFractionDigits = 2,
    notation = "standard",
    useGrouping = true,
  } = options;
  const amount = typeof _amount_ === "string" ? Number(_amount_) : _amount_;
  return new Intl.NumberFormat(language, {
    notation,
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
    useGrouping,
    ...(currency
      ? { currency, currencyDisplay: "narrowSymbol", notation: "compact", style: "currency" }
      : {}),
  }).format(amount);
}

export type UsePricesParameters = {
  refetchInterval?: number;
  formatter?: (amount: number, options: FormatNumberOptions) => string;
  currencies?: string[];
  defaultCurrency?: string;
  defaultFormatOptions?: FormatNumberOptions;
};

type FormatOptions<T> = {
  formatOptions?: FormatNumberOptions;
  currency?: string;
  format?: T;
};

const assetsWithBaseDenom = Object.fromEntries(
  Object.entries(Assets).filter(([, asset]) => asset.swapToBasePoolAddress) as [
    string,
    Currency & {
      swapToBasePoolAddress: NonNullable<Currency["swapToBasePoolAddress"]>;
    },
  ][],
);

export const PricesVersion = "0.1.0";

export function usePrices(parameters: UsePricesParameters = {}) {
  const {
    defaultCurrency = "USD",
    currencies = ["USD", "EUR"],
    refetchInterval = 60 * 1000 * 5,
    formatter = formatNumber,
    defaultFormatOptions = {
      maximumFractionDigits: 2,
      minFractionDigits: 2,
      language: typeof navigator !== "undefined" ? navigator.language : "en-US",
    },
  } = parameters;

  function getPrice<T extends boolean = false>(
    amount: number | string,
    denom: string,
    options?: FormatOptions<T>,
  ): T extends true ? string : number {
    const {
      currency = defaultCurrency,
      formatOptions = defaultFormatOptions,
      format = true,
    } = options || {};
    const price = (() => {
      const indexCurrency = currency.toLowerCase();

      // if the coingecko data are not available, or the denom is not found, return 0
      if (!data) {
        return 0;
      }

      const price = data.coingecko[denom]?.prices?.[indexCurrency] || 0;
      const coefficient = data.coefficient[denom] || 1;

      return Number(amount) * price * coefficient;
    })();

    return (format ? formatter(price, { ...formatOptions, currency }) : price) as T extends true
      ? string
      : number;
  }

  function calculateBalance<T extends boolean = false>(
    balances: Record<string, string>,
    options?: FormatOptions<T>,
  ): T extends true ? string : number {
    const {
      currency = defaultCurrency,
      formatOptions = defaultFormatOptions,
      format = false,
    } = options || {};
    const totalValue = Object.entries(balances).reduce((total, [denom, amount]) => {
      const price = getPrice(convertMicroDenomToDenom(amount, Assets[denom].decimals), denom, {
        currency,
        formatOptions,
        format: false,
      });
      total += price;
      return total;
    }, 0);
    return (
      format ? formatter(totalValue, { ...formatOptions, currency }) : totalValue
    ) as T extends true ? string : number;
  }

  const publicClient = usePublicClient();

  const { data, ...rest } = useQuery<{
    coingecko: Prices;
    coefficient: Record<string, number>;
    version: string;
  }>({
    enabled: typeof window !== "undefined",
    queryKey: ["prices", currencies],
    queryFn: async () => {
      const coinsByCoingeckoId = Object.fromEntries(
        Object.values(Assets).map((c) => [c.coingeckoId, c]),
      );

      const coinPrices = await (async () => {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${Object.keys(coinsByCoingeckoId).join(",")}&vs_currencies=${currencies.join(",")}`,
        );
        const coinPrices: Record<string, Record<string, number>> = await response.json();
        return coinPrices;
      })();

      const prices = Object.entries(Assets).reduce((acc, [denom, info]) => {
        const prices = coinPrices[info.coingeckoId || ""] || { usd: 0, eur: 0 };
        acc[denom] = { ...info, prices: prices };
        return acc;
      }, Object.create({}));

      const assets = Object.values(assetsWithBaseDenom);
      const baseDenomCoefficient: Record<string, number> = {};
      for (const asset of assets) {
        const baseDenom = Assets[asset.swapToBaseDenom || ""];
        const amount = convertDenomToMicroDenom(1, asset.decimals);
        try {
          const response = await publicClient.queryContractSmart<
            UseSwapSimulationReturnType["data"]
          >({
            address: asset.swapToBasePoolAddress,
            msg: {
              simulation: {
                offer_asset: {
                  amount: amount,
                  info: setInnerValueToAsset(asset),
                },
              },
            },
          });

          // if the base denom is not found, assume it has the same decimals as the asset
          const decimals = baseDenom?.decimals || asset.decimals;

          baseDenomCoefficient[asset.denom] =
            convertMicroDenomToDenom(response?.return_amount || "0", decimals, decimals, false) ||
            1;
        } catch (error) {
          // ignore the error, the coefficient will be 1
        }
      }

      const result = {
        version: PricesVersion,
        coingecko: prices,
        coefficient: baseDenomCoefficient,
      };

      localStorage.setItem("prices", JSON.stringify(result));
      return result;
    },
    initialData: () => {
      const defaultData = {
        coingecko: {},
        coefficient: {},
        version: PricesVersion,
      };
      if (typeof window === "undefined") return defaultData;
      try {
        const prices = localStorage.getItem("prices");
        const result = prices ? JSON.parse(prices) : {};

        if (result.version !== PricesVersion) {
          localStorage.removeItem("prices");
          return defaultData;
        }

        return result;
      } catch (error) {
        return defaultData;
      }
    },
    refetchInterval,
  });

  return { data, ...rest, calculateBalance, getPrice };
}
