import type { BaseCurrency } from "@towerfi/types";

const base: BaseCurrency = {
  denom: "ubbn",
  decimals: 6,
  symbol: "BABY",
  logoURI:
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg",
};

export const ubbn = {
  ubbn: base,
};
