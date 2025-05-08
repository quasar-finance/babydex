import { useAccount, usePublicClient } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { contracts } from "~/config";

type UseIncentiveBalanceParameters = {
  lpAddress: string;
};

type UseIncentiveBalanceReturnType = {
  balance: string;
  query: Omit<UseQueryResult, "data">;
};

export function useIncentiveBalance(
  parameters: UseIncentiveBalanceParameters,
): UseIncentiveBalanceReturnType {
  const { lpAddress } = parameters;
  const { address } = useAccount();

  const publicClient = usePublicClient();

  const { data: balance, ...query } = useQuery({
    enabled: !!address,
    queryKey: ["incentiveBalance", contracts.incentives, lpAddress, address],
    queryFn: async () => {
      const response = await publicClient.queryContractSmart({
        address: contracts.incentives,
        msg: {
          query_deposit: {
            user: address,
            lp_token: lpAddress,
          },
        },
      });

      if (!response) throw new Error("Failed to simulate withdraw");

      return response as string;
    },
    initialData: "0",
  });

  return {
    query,
    balance,
  };
}
