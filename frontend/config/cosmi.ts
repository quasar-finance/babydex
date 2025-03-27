import { createConfig, http, keplrish } from "@cosmi/react";
import { babylonTestnet } from "~/config/chains/babylon-testnet";

export const cosmi = createConfig({
  chains: [babylonTestnet],
  ssr: true,
  connectors: [
    keplrish({
      target: {
        id: "keplr",
        name: "Keplr",
        provider: (w) => w?.keplr,
      },
    }),
    keplrish({
      target: {
        id: "leap",
        name: "Leap",
        provider: (w) => w?.leap,
      },
    }),
    keplrish({
      target: {
        id: "cosmostation",
        name: "Cosmostation",
        provider: (w) => w?.cosmostation?.providers.keplr,
      },
    }),
  ],
  batch: { multicall: { batchSize: 10, wait: 200 } },
  transports: {
    [babylonTestnet.id]: http(undefined, { batch: { batchSize: 10, wait: 200 } }),
  },
});
