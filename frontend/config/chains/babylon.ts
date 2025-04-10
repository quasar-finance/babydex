import { defineChain } from "@cosmi/react";
import { isMainnet } from "~/utils/global";

export const babylonTestnet = defineChain({
  id: "bbn-test-5",
  name: "babylontestnet",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg",
  blockExplorers: {
    default: {
      name: "Babylon Testnet Explorer",
      url: "https://babylon-testnet.l2scan.co",
    },
  },
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
      default: 0.01,
    },
  },
});

export const babylonMainnet = defineChain({
  id: "bbn-1",
  name: "babylon",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/logo.svg",
  blockExplorers: {
    default: {
      name: "Babylon Testnet Explorer",
      url: "https://babylon.l2scan.co",
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
  testnet: false,
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

export const babylon = isMainnet ? babylonMainnet : babylonTestnet;
