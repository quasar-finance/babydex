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
      "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/_non-cosmos/ethereum/images/solvBTC.svg",
    coingeckoId: "solv-btc",
  },
  bbn1fkz8dcvsqyfy3apfh8ufexdn4ag00w5jts99zjw9nkjue0zhs4ts6hfdz2: {
    symbol: "uniBTC",
    type: "cw-20",
    denom: "bbn1fkz8dcvsqyfy3apfh8ufexdn4ag00w5jts99zjw9nkjue0zhs4ts6hfdz2",
    name: "UniBTC",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/uniBTC.svg",
    coingeckoId: "universal-btc",
  },
  bbn1z5gne4pe84tqerdrjta5sp966m98zgg5czqe4xu2yzxqfqv5tfkqed0jyy: {
    symbol: "uno.LBTC",
    type: "cw-20",
    denom: "bbn1z5gne4pe84tqerdrjta5sp966m98zgg5czqe4xu2yzxqfqv5tfkqed0jyy",
    name: "Lombard BTC",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/coins/lbtc.svg",
    coingeckoId: "lombard-staked-btc",
  },
  bbn1tyvxlr8qjt7yx48lhhle7xzxfxkyqwzkaxey3jekrl0gql260jlqlxgfst: {
    symbol: "uno.solvBTC",
    type: "cw-20",
    denom: "bbn1tyvxlr8qjt7yx48lhhle7xzxfxkyqwzkaxey3jekrl0gql260jlqlxgfst",
    name: "SolvBTC",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/_non-cosmos/ethereum/images/solvBTC.svg",
    coingeckoId: "solv-btc",
  },
  bbn1jr0xpgy90hqmaafdq3jtapr2p63tv59s9hcced5j4qqgs5ed9x7sr3sv0d: {
    symbol: "PumpBTC",
    type: "cw-20",
    denom: "bbn1jr0xpgy90hqmaafdq3jtapr2p63tv59s9hcced5j4qqgs5ed9x7sr3sv0d",
    name: "PumpBTC",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/pumpBTC.svg",
    coingeckoId: "pumpbtc",
  },
  bbn1ccylwef8yfhafxpmtzq4ps24kxce9cfnz0wnkucsvf2rylfh0jzswhk5ks: {
    symbol: "stBTC",
    type: "cw-20",
    denom: "bbn1ccylwef8yfhafxpmtzq4ps24kxce9cfnz0wnkucsvf2rylfh0jzswhk5ks",
    name: "Lorenzo BTC",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/stbtc.svg",
    coingeckoId: "bitcoin",
  },
  bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x: {
    symbol: "satUniBTC",
    type: "cw-20",
    denom: "bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x",
    name: "Satlayer uniBTC",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/uniBTC.svg",
    coingeckoId: "universal-btc",
  }
} as unknown as Record<string, Currency>;
