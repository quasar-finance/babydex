"use client";

import { useQuery } from "@tanstack/react-query";
import { Assets } from "~/config";
import type { Currency } from "@towerfi/types";
import type { Prettify } from "cosmi/types";
import { convertMicroDenomToDenom } from "~/utils/intl";

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
      if (!data || !data?.[denom]?.prices?.[indexCurrency]) return 0;
      return Number(amount) * data[denom].prices[indexCurrency];
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

  const { data, ...rest } = useQuery<Prices>({
    enabled: typeof window !== "undefined",
    queryKey: ["prices", currencies],
    queryFn: async () => {
      const coinsByCoingeckoId = Object.fromEntries(
        Object.values(Assets).map((c) => [c.coingeckoId, c]),
      );

      const coinPrices = await (async () => {
        // if (window.location.protocol !== "https:") {
        //   return Object.keys(coinsByCoingeckoId).reduce((acc, key) => {
        //     const usd = Math.random() * 100_000;
        //     acc[key] = { usd, eur: usd * 0.95 };
        //     return acc;
        //   }, Object.create({}));
        // }
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

      localStorage.setItem("prices", JSON.stringify(prices));
      return prices;
    },
    initialData: () => {
      if (typeof window === "undefined") return {};

      try {
        const prices = localStorage.getItem("prices");
        return prices ? JSON.parse(prices) : {};
      } catch {
        return {};
      }
    },
    refetchInterval,
  });

  return { data, ...rest, calculateBalance, getPrice };
}
