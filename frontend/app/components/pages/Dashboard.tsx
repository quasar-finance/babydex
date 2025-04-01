"use client";

import type React from "react";
import { Button } from "../atoms/Button";
import { trpc } from "~/trpc/client";
import { useAccount } from "@cosmi/react";
import { UserPools } from "../organisms/dashboard/UserPools";
import { useDexClient } from "~/app/hooks/useDexClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contracts } from "~/config";
import { useToast } from "~/app/hooks";

const Dashboard: React.FC = () => {
  const { address, chain } = useAccount();
  const { data: signingClient } = useDexClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pools = [], isLoading: isPoolLoading } = trpc.local.pools.getUserPools.useQuery({
    address,
  });

  const { mutateAsync: claimAll, isLoading } = useMutation({
    mutationFn: async () => {
      if (!signingClient || !address) return;
      return await signingClient.claimRewards({
        sender: address,
        incentiveAddress: contracts.incentives,
        lpTokens: pools
          .filter((pool) => pool.userBalance.staked_share_amount > 0)
          .map((pool) => pool.userBalance.lpToken),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(trpc.local.pools.getUserPools.getQueryKey({ address }));
      toast.success({
        title: "Claim successful",
        component: () => (
          <div className="flex flex-col gap-1">
            {data ? (
              <a
                className="underline hover:no-underline"
                target="_blank"
                href={`${chain?.blockExplorers?.default.url}/tx/${data}`}
                rel="noreferrer"
              >
                See tx
              </a>
            ) : (
              <p>All your rewards were claimed</p>
            )}
          </div>
        ),
      });
    },
    onError: (error: Error) => {
      toast.error({
        title: "Claim Failed",
        description: `Failed to claim all your rewards. ${error.message}`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-8 px-4 max-w-[84.5rem] mx-auto w-full min-h-[65vh]">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <h1 className="text-xl">My Liquidity Positions</h1>
        <div className="flex gap-3 h-[42px] items-center lg:px-2">
          <Button color="tertiary" isDisabled>
            New Position
          </Button>
          <Button onClick={() => claimAll()} isDisabled={!address} isLoading={isLoading}>
            Claim All
          </Button>
        </div>
      </div>
      <UserPools pools={pools} isLoading={isPoolLoading} />
    </div>
  );
};

export default Dashboard;
