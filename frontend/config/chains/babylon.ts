import { defineChain } from "@cosmi/react";

export const babylonTestnet = defineChain({
  id: "bbn-1",
  name: "babylon",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/logo.svg",
  blockExplorers: {
    default: {
      name: "Babylon Testnet Explorer",
      url: "https://hub-mintscan--main-u8lpz0wb.web.app",
    },
  },
  nativeCurrency: {
    decimals: 6,
    name: "ubbn",
    symbol: "BABY",
  },
  rpcUrls: {
    default: {
      http: ["https://babylon.nodes.guru:443/rpc"],
    },
  },
  fees: {
    baseFeeMultiplier: 1.4,
  },
  testnet: true,
  custom: {
    registry: {
      assets:
        "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/babylon/assetlist.json",
      chain:
        "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/babylon/chain.json",
    },
    gasSteps: {
      default: 0.01,
    },
  },
});
