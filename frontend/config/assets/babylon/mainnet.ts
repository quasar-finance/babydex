import type { Currency } from "@towerfi/types";

export const BabylonMainnetAssets = {
  ubbn: {
    denom: "ubbn",
    name: "Babylon Testnet Native Token",
    type: "native",
    decimals: 6,
    symbol: "BABY",
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg",
  },
  "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3": {
    symbol: "USDC",
    type: "ibc",
    denom: "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3",
    name: "USDC Noble",
    decimals: 6,
    logoURI: "/assets/default.png",
    coingeckoId: "usd-coin",
  },
  "ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7": {
    symbol: "LBTC",
    type: "ibc",
    denom: "ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7",
    name: "Lombard BTC",
    decimals: 8,
    logoURI: "/assets/default.png",
    coingeckoId: "lombard-staked-btc",
  },
} as unknown as Record<string, Currency>;
