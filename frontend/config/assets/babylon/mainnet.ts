import type { Currency } from "@towerfi/types";

export const BabylonMainnetAssets = {
  ubbn: {
    denom: "ubbn",
    name: "Babylon Native Token",
    type: "native",
    decimals: 6,
    symbol: "BABY",
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/logo.svg",
    coingeckoId: "babylon",
  },
  "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3": {
    symbol: "USDC",
    type: "ibc",
    denom: "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3",
    name: "USDC Noble",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.png",
    coingeckoId: "usd-coin",
  },
  "ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7": {
    symbol: "LBTC",
    type: "ibc",
    denom: "ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7",
    name: "Lombard BTC",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/coins/lbtc.svg",
    coingeckoId: "lombard-staked-btc",
  },
  bbn1s7jzz7cyuqmy5xpr07yepka5ngktexsferu2cr4xeww897ftj77sv30f5s: {
    symbol: "eBABY",
    type: "cw-20",
    denom: "bbn1s7jzz7cyuqmy5xpr07yepka5ngktexsferu2cr4xeww897ftj77sv30f5s",
    name: "Babylon Escher LST",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/eBABY.svg",
    coingeckoId: "babylon",
  },
  bbn17y5zvse30629t7r37xsdj73xsqp7qsdr7gpnh966wf5aslpn66rq5ekwsz: {
    symbol: "cBABY",
    type: "cw-20",
    denom: "bbn17y5zvse30629t7r37xsdj73xsqp7qsdr7gpnh966wf5aslpn66rq5ekwsz",
    name: "Babylon Cube By SatLayer LST",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/cbaby.svg",
    coingeckoId: "babylon",
  },
  "ibc/2CC08A10459B40B0251B8CB9C036C98BED1ABBD5F03772E371DCD0FFDA3EC7F3": {
    symbol: "SolvBTC",
    type: "native",
    denom: "ibc/2CC08A10459B40B0251B8CB9C036C98BED1ABBD5F03772E371DCD0FFDA3EC7F3",
    name: "SolvBTC",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/SolvBTC.png",
  },
  coingeckoId: "solv-btc",
} as unknown as Record<string, Currency>;
