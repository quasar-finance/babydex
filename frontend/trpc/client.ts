import { appRouter, createCoingeckoService, createLruService } from "@towerfi/trpc";
import { createTRPCReact, getFetch, httpBatchLink, loggerLink, splitLink } from "@trpc/react-query";

import type { AppRouter } from "@towerfi/trpc";
import { createLocalTRPCLink } from "./router";
import { contracts, Assets } from "~/config";
import { createPublicClient, http } from "cosmi";
import { babylonTestnet } from "~/config/chains/babylon-testnet";

const cacheService = createLruService();
const coingeckoService = createCoingeckoService({ cacheService });

export const trpc = createTRPCReact<AppRouter>();

export const createClient = () =>
  trpc.createClient({
    links: [
      loggerLink({
        enabled: () => true,
      }),
      splitLink({
        condition: (op) => {
          return op.path.startsWith("local");
        },
        true: createLocalTRPCLink({
          router: appRouter,
          cacheService,
          coingeckoService,
          contracts,
          assets: Assets,
          publicClient: createPublicClient({
            transport: http(babylonTestnet.rpcUrls.default.http.at(0)),
          }),
        }),
        false: httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL ?? "",
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      }),
    ],
  });
