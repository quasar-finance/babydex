import { createConfig, http, keplrish } from "@cosmi/react";
import { babylon } from "~/config/chains/babylon";
import { multisig } from "~/multisig/connector";

export const cosmi = createConfig({
  chains: [babylon],
  ssr: true,
  connectors: [
    keplrish({
      shimDisconnect: true,
      target: {
        id: "keplr",
        name: "Keplr",
        provider: (w) => w?.keplr,
      },
    }),
    keplrish({
      shimDisconnect: true,
      target: {
        id: "leap",
        name: "Leap",
        provider: (w) => w?.leap,
      },
    }),
    keplrish({
      shimDisconnect: true,
      target: {
        id: "cosmostation",
        name: "Cosmostation",
        provider: (w) => w?.cosmostation?.providers.keplr,
      },
    }),
    multisig({shimDisconnect: true}),
  ],
  batch: { multicall: { batchSize: 10, wait: 200 } },
  transports: {
    [babylon.id]: http(undefined, { batch: { batchSize: 10, wait: 200 } }),
  },
});
