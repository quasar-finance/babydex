import type React from "react";
import { Button } from "../Button";
import { twMerge } from "~/utils/twMerge";
import type { Asset } from "@towerfi/types";
import { useDexClient } from "~/app/hooks/useDexClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "@cosmi/react";
import { contracts } from "~/config";
import { trpc } from "~/trpc/client";
import { getInnerValueFromAsset } from "@towerfi/trpc";
import { convertMicroDenomToDenom } from "~/utils/intl";
import Tooltip from "../Tooltip";
import { useToast } from "~/app/hooks";
import { usePrices } from "~/app/hooks/usePrices";

interface Props {
  title?: string;
  rewards: Asset[];
  poolToken: string;
  className?: string;
  stakedAmount?: number;
}

export const CellClaimRewards: React.FC<Props> = ({
  title = "Claimable Rewards",
  rewards,
  poolToken,
  className,
  stakedAmount,
}) => {
  const { address, chain } = useAccount();
  const { data: signingClient } = useDexClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getPrice } = usePrices();

  const { mutateAsync: claimReward, isLoading } = useMutation({
    mutationFn: async () => {
      if (!signingClient || !address) return;
      return await signingClient.claimRewards({
        sender: address,
        incentiveAddress: contracts.incentives,
        lpTokens: [poolToken],
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(trpc.local.pools.getUserPools.getQueryKey({ address }));
      toast.success({
        title: "Claim successful",
        component: () => (
          <div className="flex flex-col gap-1">
            <a
              className="underline hover:no-underline"
              target="_blank"
              href={`${chain?.blockExplorers?.default.url}/tx/${data?.hash}`}
              rel="noreferrer"
            >
              See tx
            </a>
          </div>
        ),
      });
    },
    onError: (error: Error) => {
      toast.error({
        title: "Claim Failed",
        description: `Failed to claim your rewards. ${error.message}`,
      });
    },
  });

  const { data: assets, isLoading: isLoadingAssets } = trpc.local.assets.getAssets.useQuery({
    assets: rewards.map((r) => {
      const { denom } = getInnerValueFromAsset(r.info);
      return denom;
    }),
  });

  const totalValue =
    assets?.reduce((sum, asset, i) => {
      const amount = convertMicroDenomToDenom(
        rewards[i].amount,
        asset.decimals,
        asset.decimals,
        false,
      );
      const price = getPrice(amount, asset.denom, { format: false });
      return sum + price;
    }, 0) || 0;

  const totalValueformatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalValue);

  const hasRewards = totalValue > 0 || rewards.some((r) => Number(r.amount) > 0);

  if (!stakedAmount) {
    return (
      <div className={twMerge("flex flex-col gap-2", className)}>
        <p className="text-xs text-white/50 lg:hidden">{title}</p>
        <div className="flex gap-2 items-center">
          <Button
            color="secondary"
            size="sm"
            onClick={() => claimReward()}
            isLoading={isLoading}
            isDisabled={stakedAmount === 0 || isLoading}
          >
            Claim
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">{title}</p>
      <div className="flex gap-2 items-center">
        {hasRewards ? (
          <Tooltip
            content={
              <div className="flex flex-col gap-2">
                <p className="text-tw-orange-400">Total assets</p>
                <div className="flex flex-col gap-1">
                  {assets?.map((asset, i) => {
                    return (
                      <div key={i} className="flex items-center justify-between gap-4">
                        <div className="flex gap-1 items-center">
                          <img src={asset.logoURI} alt={asset.symbol} className="w-4 h-4" />
                          <p className="text-xs text-white/50">{asset.symbol}</p>
                        </div>
                        <p className="flex gap-2 flex-col text-center">
                          {convertMicroDenomToDenom(rewards[i].amount, asset.decimals)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          >
            {totalValueformatted}
          </Tooltip>
        ) : (
          "$0.00"
        )}
        <Button
          color="secondary"
          size="sm"
          onClick={() => claimReward()}
          isLoading={isLoading}
          isDisabled={
            isLoading || rewards.length === 0 || rewards.every((r) => Number(r.amount) === 0)
          }
        >
          Claim
        </Button>
      </div>
    </div>
  );
};
