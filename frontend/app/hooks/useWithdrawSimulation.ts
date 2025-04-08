import { usePublicClient } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getInnerValueFromAsset } from "@towerfi/trpc";
import type { Asset, Currency, WithAmount, WithPrice } from "@towerfi/types";

type UseWithdrawSimulationParameters = {
  amount: number | string;
  assets: WithPrice<Currency>[];
  poolAddress: string;
};

type UseWithdrawSimulationReturnType = {
  simulation: WithAmount<WithPrice<Currency>>[];
  query: Omit<UseQueryResult, "data">;
};

export function useWithdrawSimulation(
  parameters: UseWithdrawSimulationParameters,
): UseWithdrawSimulationReturnType {
  const { poolAddress, assets, amount } = parameters;

  const publicClient = usePublicClient();

  const { data: response, ...query } = useQuery({
    queryKey: ["simulateWithdraw", poolAddress, amount],
    queryFn: async () => {
      const response = await publicClient.queryContractSmart({
        address: poolAddress,
        msg: {
          simulate_withdraw: {
            lp_amount: amount.toString(),
          },
        },
      });

      if (!response) throw new Error("Failed to simulate withdraw");

      const sortedTokens = response.sort((a: Asset) => {
        const { denom } = getInnerValueFromAsset(a.info);
        return denom === assets[0].denom ? -1 : 1;
      });

      return [sortedTokens[0].amount, sortedTokens[1].amount];
    },
    initialData: [0, 0],
  });

  const [token0Amount, token1Amount] = response;

  return {
    query,
    simulation: [
      {
        ...assets[0],
        amount: token0Amount,
      },
      {
        ...assets[1],
        amount: token1Amount,
      },
    ],
  };
}
