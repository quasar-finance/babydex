import { createConfig, http, keplrish } from "@cosmi/react";
import { babylon } from "~/config/chains/babylon";

export const cosmi = createConfig({
  chains: [babylon],
  ssr: true,
  connectors: [
    keplrish({
      target: {
        id: "keplr",
        name: "Keplr",
        provider: (w) => w?.keplr,
      },
    }),
    /* keplrish({
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
    }), */
  ],
  batch: { multicall: { batchSize: 10, wait: 200 } },
  transports: {
    [babylon.id]: http(undefined, { batch: { batchSize: 10, wait: 200 } }),
  },
});
