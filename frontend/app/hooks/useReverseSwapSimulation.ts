import { usePublicClient } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { setInnerValueToAsset } from "@towerfi/trpc";
import type { Currency, WithPrice } from "@towerfi/types";
import BigNumber from "bignumber.js";

type UseReverseSwapSimulationParameters = {
  amount: number | string;
  assets: WithPrice<Currency>[];
  poolAddress: string;
};

type UseReverseSwapSimulationReturnType = UseQueryResult<{
  commission_amount: string;
  offer_amount: string;
  spread_amount: string;
}>;

export function useReverseSwapSimulation(
  parameters: UseReverseSwapSimulationParameters,
): UseReverseSwapSimulationReturnType {
  const { poolAddress, assets, amount } = parameters;

  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["simulateReverseSwap", poolAddress, amount],
    enabled: !!poolAddress && BigNumber(amount).gt(0),
    queryFn: async () => {
      const response = await publicClient.queryContractSmart({
        address: poolAddress,
        msg: {
          reverse_simulation: {
            ask_asset: {
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
