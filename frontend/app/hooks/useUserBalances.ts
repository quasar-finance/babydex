import { useAccount, usePublicClient } from "@cosmi/react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { Currency, WithAmount } from "@towerfi/types";
import { getCw20Balance } from "~/actions/getCw20Balance";

export type UseUserBalancesParameters = {
  assets: Currency[];
};

export type UseUserBalancesReturnType = UseQueryResult<WithAmount<Currency>[]>;

export function useUserBalances(parameters: UseUserBalancesParameters): UseUserBalancesReturnType {
  const { assets } = parameters;
  const { address } = useAccount();
  const publicClient = usePublicClient();

  return useQuery({
    enabled: !!address,
    queryKey: ["balances", address, assets],
    queryFn: async () =>
      await Promise.all(
        assets.map(async (asset) => {
          if (asset.type !== "cw-20") {
            const balance = await publicClient.queryBalance({
              address: address as string,
              denom: asset.denom,
            });
            return { ...asset, amount: balance?.amount || "0" };
          }

          const { balance } = await getCw20Balance(publicClient, {
            address: asset.denom,
            owner: address as string,
          });
          return { ...asset, amount: balance };
        }),
      ),
  });
}
