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

interface Props {
  pool: PoolInfo;
  balance: UserPoolBalances;
}

export const ModalUnstakeLiquidity: React.FC<Props> = ({ pool, balance }) => {
  const { name, assets } = pool;
  const { staked_share_amount } = balance;
  const [percentage, setPercentage] = useState(50);
  const { data: signingClient } = useDexClient();
  const { address } = useAccount();
  const client = useQueryClient();

  const {
    isLoading,
    mutateAsync: unstake,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!signingClient) return;
      await signingClient.unstakeLiquidity({
        sender: address as string,
        lpTokenAddress: pool.lpAddress,
        amount: (staked_share_amount * (percentage / 100)).toFixed(0),
        incentiveAddress: contracts.incentives,
      });
    },
    onSuccess: () => {
      client.invalidateQueries(trpc.local.pools.getUserPools.getQueryKey({ address }));
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
            <Pill>0,3%</Pill>
          </div>
        </div>
        <Divider dashed />
        <div className="flex flex-col gap-2 p-4">
          <p className="text-white/50 text-sm">Available Staked Deposit</p>
          <div className="flex w-full items-center gap-2">
            <AssetAmountSquare asset={assets[0]} balance={token0Amount} style="bordered" />
            <AssetAmountSquare asset={assets[1]} balance={token1Amount} style="bordered" />
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
          <AssetAmountSquare
            asset={assets[0]}
            balance={(token0Amount * (percentage / 100)).toFixed(0)}
          />
          <AssetAmountSquare
            asset={assets[1]}
            balance={(token1Amount * (percentage / 100)).toFixed(0)}
          />
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
