import type { Simplify } from "type-fest";

export type WithGasPriceStep<T> = T & {
  readonly gasPriceStep: {
    readonly low: number;
    readonly average: number;
    readonly high: number;
  };
};

export type Bridge = "union" | "ibc-eureka";

export type BaseCurrency = {
  readonly name: string;
  readonly symbol: string;
  readonly denom: string;
  readonly decimals: number;
  readonly logoURI: string;
  readonly coingeckoId?: string;
  readonly bridge?: Bridge[];
  readonly ethereumAddress?: string;
};

export type WithPrice<T> = T & {
  readonly price: number;
};

export type WithAmount<T> = T & {
  readonly amount: number;
};

export type NativeCurrency = Simplify<
  BaseCurrency & {
    readonly type: "native";
  }
>;

export type CW20Currency = Simplify<
  BaseCurrency & {
    readonly type: "cw-20";
    readonly contractAddress: string;
  }
>;

export type IBCCurrency = Simplify<
  BaseCurrency & {
    readonly type: "ibc";
    readonly portId: string;
    readonly channelId: string;
    readonly origin: {
      readonly portId: string;
      readonly channelId: string;
      readonly asset: Currency;
    };
  }
>;

export type FeeCurrency = WithGasPriceStep<NativeCurrency | IBCCurrency>;

export type Currency = NativeCurrency | CW20Currency | IBCCurrency;
