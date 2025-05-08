import { usePublicClient } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { setInnerValueToAsset } from "@towerfi/trpc";
import type { Currency, WithPrice } from "@towerfi/types";
import BigNumber from "bignumber.js";

type UseSwapSimulationParameters = {
  amount: number | string;
  assets: WithPrice<Currency>[];
  poolAddress: string;
};

export type UseSwapSimulationReturnType = UseQueryResult<{
  commission_amount: string;
  return_amount: string;
  spread_amount: string;
}>;

export function useSwapSimulation(
  parameters: UseSwapSimulationParameters,
): UseSwapSimulationReturnType {
  const { poolAddress, assets, amount } = parameters;

  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["simulateSwap", poolAddress, assets[0].denom, amount],
    enabled: !!poolAddress && BigNumber(amount).gt(0),
    staleTime: 1000 * 10, // 10 seconds
    queryFn: async () => {
      const response = await publicClient.queryContractSmart({
        address: poolAddress,
        msg: {
          simulation: {
            offer_asset: {
              amount: amount.toString(),
              info: setInnerValueToAsset(assets[0]),
            },
          },
        },
      });

      if (!response) throw new Error("Failed to simulate withdraw");

      return response;
    },
  });
}
