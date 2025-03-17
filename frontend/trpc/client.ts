import { appRouter } from "@towerfi/trpc";
import { createTRPCReact, getFetch, httpBatchLink, loggerLink, splitLink } from "@trpc/react-query";

import type { AppRouter, ContextOptions } from "@towerfi/trpc";
import { createLocalTRPCLink } from "./router";

export const trpc = createTRPCReact<AppRouter>();

export const createClient = (ctx: Omit<ContextOptions, "indexerService">) =>
  trpc.createClient({
    links: [
      loggerLink({
        enabled: () => true,
      }),
      splitLink({
        condition: (op) => {
          return op.path.startsWith("local");
        },
        true: createLocalTRPCLink({ router: appRouter, ...ctx }),
        false: httpBatchLink({
          url: process.env.API_URL ?? "",
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
