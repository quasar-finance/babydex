import { useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";
import { twMerge } from "~/utils/twMerge";

import Divider from "~/app/components/atoms/Divider";

import type { PoolInfo, UserPoolBalances } from "@towerfi/types";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import Input from "../../atoms/Input";
import { RangeSelector } from "../../atoms/RangeSelector";
import { AssetAmountSquare } from "../../atoms/AssetAmountSquare";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDexClient } from "~/app/hooks/useDexClient";
import { useAccount } from "@cosmi/react";
import { contracts } from "~/config";
import { trpc } from "~/trpc/client";
import { useWithdrawSimulation } from "~/app/hooks/useWithdrawSimulation";
import { useToast } from "~/app/hooks";
import { toFullNumberString } from "~/utils/intl";

interface Props {
  pool: PoolInfo;
  balance: UserPoolBalances;
}

export const ModalUnstakeLiquidity: React.FC<Props> = ({ pool, balance }) => {
  const { name, assets } = pool;
  const { staked_share_amount } = balance;
  const [percentage, setPercentage] = useState(50);
  const { data: signingClient } = useDexClient();
  const { address, chain } = useAccount();
  const client = useQueryClient();
  const { toast } = useToast();

  const {
    isLoading,
    mutateAsync: unstake,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!signingClient) return;
      return await signingClient.unstakeLiquidity({
        sender: address as string,
        lpTokenAddress: pool.lpAddress,
        amount: toFullNumberString((staked_share_amount * (percentage / 100)).toFixed(0)),
        incentiveAddress: contracts.incentives,
      });
    },
    onSuccess: (data) => {
      client.invalidateQueries(trpc.local.pools.getUserPools.getQueryKey({ address }));
      toast.success({
        title: "Unstake successful",
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
        title: "Unstake failed",
        description: `Failed to unstake ${percentage}% of stake deposit. ${error.message}`,
      });
    },
  });

  const {
    simulation: [{ amount: token0Amount }, { amount: token1Amount }],
    query: { isLoading: isSimulateLoading },
  } = useWithdrawSimulation({
    poolAddress: pool.poolAddress,
    assets: pool.assets,
    amount: balance.staked_share_amount,
  });

  const simulationFailed = !token0Amount || !token1Amount;

  return (
    <BasicModal
      title="Unstake"
      classNames={{ wrapper: "max-w-md", container: "p-0" }}
      separator={false}
    >
      <form className="flex flex-col w-full">
        <div className={twMerge("col-span-2 lg:col-span-1 flex flex-col gap-2 p-4")}>
          <div className="flex items-center  justify-between gap-3">
            <div className="flex items-center gap-3">
              <AssetsStacked assets={assets} size="lg" />
              <span>{name}</span>
            </div>
            <Pill>{pool.config.params.fee_gamma || 0}%</Pill>
          </div>
        </div>
        <Divider dashed />
        <div className="flex flex-col gap-2 p-4">
          <p className="text-white/50 text-sm">Available Staked Deposit</p>
          <div className="flex w-full items-center gap-2">
            {simulationFailed ? (
              <div className="bg-white/10 flex-1 flex flex-col gap-2  p-4 rounded-2xl">
                {toFullNumberString(balance.staked_share_amount)}
              </div>
            ) : (
              <>
                <AssetAmountSquare
                  asset={assets[0]}
                  balance={token0Amount}
                  style="bordered"
                  isLoading={isSimulateLoading}
                />
                <AssetAmountSquare
                  asset={assets[1]}
                  balance={token1Amount}
                  style="bordered"
                  isLoading={isSimulateLoading}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 py-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-white/50">Unstake</p>
            <Input
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-[4rem] text-lg rounded-lg"
              endContent={
                <div className="flex gap-2 items-center text-lg">
                  <span className="text-white/10">|</span>
                  <span className="text-white/50">%</span>
                </div>
              }
              value={percentage}
            />
            <p className="text-sm text-white/50">of Staked Deposit</p>
          </div>
          <RangeSelector value={percentage} onChange={setPercentage} />
        </div>
        <div className="flex w-full items-center gap-2 p-4">
          {simulationFailed ? (
            <div className="border border-white/10 flex-1 flex flex-col gap-2 p-4 rounded-2xl">
              {toFullNumberString((balance.staked_share_amount * (percentage / 100)).toFixed(0))}
            </div>
          ) : (
            <>
              {" "}
              <AssetAmountSquare
                asset={assets[0]}
                balance={(token0Amount * (percentage / 100)).toFixed(0)}
                isLoading={isSimulateLoading}
              />
              <AssetAmountSquare
                asset={assets[1]}
                balance={(token1Amount * (percentage / 100)).toFixed(0)}
                isLoading={isSimulateLoading}
              />
            </>
          )}
        </div>
        <Divider dashed />
        <div className="p-4">
          <Button fullWidth onClick={() => unstake()} isLoading={isLoading}>
            Unstake
          </Button>
        </div>
      </form>
    </BasicModal>
  );
};
