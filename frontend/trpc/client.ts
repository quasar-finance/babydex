import { appRouter, createCoingeckoService, createLruService } from "@towerfi/trpc";
import { createTRPCReact, getFetch, httpBatchLink, loggerLink, splitLink } from "@trpc/react-query";

import type { AppRouter } from "@towerfi/trpc";
import { createLocalTRPCLink } from "./router";
import { contracts, Assets } from "~/config";
import { createPublicClient, http } from "cosmi";
import { babylon } from "~/config/chains/babylon";

const cacheService = createLruService();
const coingeckoService = createCoingeckoService({ cacheService });

export const trpc = createTRPCReact<AppRouter>();

export const createClient = () =>
  trpc.createClient({
    links: [
      loggerLink({
        enabled: () => !(process.env.NEXT_PUBLIC_ENV === "production"),
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
            transport: http(babylon.rpcUrls.default.http.at(0), {
              batch: { batchSize: 10, wait: 200 },
            }),
          }),
        }),
        false: httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL ?? "",
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
            });
          },
        }),
      }),
    ],
  });
