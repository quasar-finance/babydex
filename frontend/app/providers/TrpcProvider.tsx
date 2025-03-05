import { createClient, trpc } from "~/trpc/client";
import { contracts, Assets } from "~/config";
import { createCoingeckoService, createLruService } from "@towerfi/trpc";

import type React from "react";
import type { PropsWithChildren } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { useConfig, usePublicClient } from "wagmi";

const cacheService = createLruService();
const coingeckoService = createCoingeckoService({ cacheService });

interface Props {
  queryClient: QueryClient;
}

export const TrpcProvider: React.FC<PropsWithChildren<Props>> = ({ children, queryClient }) => {
  const config = useConfig();
  const publicClient = usePublicClient();

  return (
    <trpc.Provider
      client={createClient({
        contracts,
        assets: Assets,
        publicClient,
        cacheService,
        coingeckoService,
      })}
      queryClient={queryClient}
    >
      {children}
    </trpc.Provider>
  );
};
