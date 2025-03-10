import { defineChain } from "@cosmi/react";

export const babylonTestnet = defineChain({
  id: "bbn-test-5",
  name: "babylontestnet",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg",
  nativeCurrency: {
    decimals: 6,
    name: "ubbn",
    symbol: "BABY",
  },
  rpcUrls: {
    default: {
      http: ["https://babylon-testnet-rpc.nodes.guru"],
    },
  },
  fees: {
    baseFeeMultiplier: 1.4,
  },
  testnet: true,
  custom: {
    registry: {
      assets:
        "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/testnets/babylontestnet/assetlist.json",
      chain:
        "https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/testnets/babylontestnet/chain.json",
    },
    gasSteps: {
      default: 0.007,
    },
  },
});
