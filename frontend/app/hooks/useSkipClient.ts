import { useAccount } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { SkipClient } from "@skip-go/client";

export function useSkipClient(): UseQueryResult<SkipClient> {
  const { isConnected, connector, address } = useAccount();

  const { emitter, ...rest } = connector || {};

  return useQuery({
    enabled: isConnected,
    queryKey: ["skipClient", address, rest],
    queryFn: () => {
      return new SkipClient({
        getCosmosSigner: async (chainID: string) => {
          if (!connector) throw new Error("No connector found");
          const provider = (await connector?.getProvider()) as unknown as {
            getOfflineSignerAuto: (chainId: string) => void;
          };
          return (await provider.getOfflineSignerAuto(chainID)) as any;
        },
      });
    },
  });
}
