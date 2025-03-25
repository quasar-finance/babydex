import { useAccount } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type RouteRequest, type RouteResponse, SkipClient } from "@skip-go/client";
import type { WalletClient } from "viem";
import { useRef } from "react";
import { sleep } from "~/utils/promises";

type UseSkipClientParameters = {
  cacheKey?: string;
  getEVMSigner?: (chainID: string) => Promise<WalletClient>;
};

export function useSkipClient(parameters: UseSkipClientParameters = {}): {
  simulate: (request: RouteRequest) => Promise<RouteResponse>;
  simulation: UseQueryResult<RouteResponse | null>;
  skipClient: SkipClient | undefined;
} {
  const { connector, address } = useAccount();
  const { getEVMSigner, cacheKey = ["skipClient", address] } = parameters;
  const requestRef = useRef<RouteRequest | null>(null);

  const { data: skipClient } = useQuery({
    queryKey: ["query", address, cacheKey],
    queryFn: () => {
      return new SkipClient({
        getEVMSigner,
        getCosmosSigner: async (chainID: string) => {
          if (!connector) throw new Error("skip client: no connector found");
          const provider = (await connector.getProvider()) as {
            getOfflineSignerAuto: (chainId: string) => void;
          };
          return (await provider.getOfflineSignerAuto(chainID)) as any;
        },
      });
    },
  });

  const simulation = useQuery({
    enabled: Boolean(skipClient),
    cacheTime: 0,
    queryKey: ["query", "simulation", cacheKey],
    queryFn: async ({ signal }) => {
      await sleep(300);
      if (signal?.aborted || !requestRef.current) return null;
      if (!skipClient) throw new Error("skip client: no client");
      return await skipClient.route(requestRef.current);
    },
  });

  const simulate = async (request: RouteRequest): Promise<RouteResponse> => {
    requestRef.current = request;
    const { data } = await simulation.refetch();
    return data as RouteResponse;
  };

  return {
    simulate,
    simulation,
    skipClient,
  };
}
