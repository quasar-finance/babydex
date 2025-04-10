import { useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";
import { twMerge } from "~/utils/twMerge";

import Divider from "~/app/components/atoms/Divider";
import { contracts } from "~/config";

import type { PoolInfo, UserPoolBalances } from "@towerfi/types";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import Input from "../../atoms/Input";
import { RangeSelector } from "../../atoms/RangeSelector";
import { useDexClient } from "~/app/hooks/useDexClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount } from "@cosmi/react";
import { AssetAmountSquare } from "../../atoms/AssetAmountSquare";
import { useWithdrawSimulation } from "~/app/hooks/useWithdrawSimulation";
import { useToast } from "~/app/hooks";
import { useModal } from "~/app/providers/ModalProvider";

interface ModalRemoveLiquidityProps {
  pool: PoolInfo;
  balance: UserPoolBalances;
  refreshUserPools?: () => void;
}

const ModalRemoveLiquidity: React.FC<ModalRemoveLiquidityProps> = ({
  pool,
  balance,
  refreshUserPools,
}) => {
  const { name, assets } = pool;
  const { staked_share_amount } = balance;
  const { toast } = useToast();
  const { hideModal } = useModal();

  const [percentage, setPercentage] = useState(50);

  const { data: signingClient } = useDexClient();
  const { address, chain } = useAccount();

  const { isLoading, mutateAsync: withdraw } = useMutation({
    mutationFn: async () => {
      if (!signingClient) return;
      return await signingClient.withdrawLiquidity({
        sender: address as string,
        poolAddress: pool.poolAddress,
        lpTokenAddress: pool.lpAddress,
        amount: (staked_share_amount * (percentage / 100)).toFixed(0),
        incentiveAddress: contracts.incentives,
      });
    },
    onSuccess: (data) => {
      toast.success({
        title: "Withdraw successful",
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
      hideModal();
      refreshUserPools?.();
    },
    onError: (error: Error) => {
      toast.error({
        title: "Withdraw failed",
        description: `Failed to withdraw ${percentage}% of staked deposit. ${error.message}`,
      });
    },
  });

  const {
    simulation: [{ amount: token0Amount }, { amount: token1Amount }],
    query: { isLoading: isSimulateLoading },
  } = useWithdrawSimulation({
    poolAddress: pool.poolAddress,
    assets,
    amount: staked_share_amount,
  });

  return (
    <BasicModal
      title="Remove Liquidity"
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
            <AssetAmountSquare asset={assets[0]} balance={token0Amount} style="bordered" />
            <AssetAmountSquare asset={assets[1]} balance={token1Amount} style="bordered" />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 py-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-white/50">Remove</p>
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
            <p className="text-sm text-white/50">of Liquidity</p>
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
          <Button fullWidth isLoading={isLoading} onClick={() => withdraw()}>
            Remove Liquidity
          </Button>
        </div>
      </form>
    </BasicModal>
  );
};

export default ModalRemoveLiquidity;
