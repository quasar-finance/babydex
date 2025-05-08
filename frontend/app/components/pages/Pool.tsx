"use client";

import { trpc } from "~/trpc/client";
import BackButton from "../atoms/BackButton";
import PoolSkeleton from "../molecules/skeletons/PoolSkeleton";
import { Fragment, useCallback, useState } from "react";
import AssetsStacked from "../atoms/AssetsStacked";
import { PoolFeePill, PoolIncentivesPill, PoolTypePill } from "../atoms/PoolPill";
import Skeleton from "../atoms/Skeleton";
import { Metrics } from "../organisms/pool/Metrics";
import { PeriodToggle, periodToNumber, type Period } from "../atoms/PeriodToggle";
import { Overview } from "../organisms/pool/Overview";
import { useAccount } from "@cosmi/react";
import { Button } from "../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { UserPositions } from "../organisms/pool/UserPositions";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalAddLiquidity } from "../molecules/modals/ModalAddLiquidity";
import { FadeInOut } from "../atoms/FadeInOut";
import { Swap } from "../organisms/pool/Swap";
import { useQueryClient } from "@tanstack/react-query";

const Pool: React.FC<{
  address: string;
}> = ({ address }) => {
  const {
    data: pool,
    isLoading: poolIsLoading,
    refetch: refetchPool,
  } = trpc.local.pools.getPool.useQuery({
    address,
  });
  const client = useQueryClient();

  const [aprTimeframe, setAprTimeframe] = useState<Period>("7d");
  const onAprTimeframeChange = useCallback(
    (period: Period) => {
      setAprTimeframe(period);
    },
    [setAprTimeframe],
  );

  const { data: incentiveApr, isLoading: incentiveAprsIsLoading } =
    trpc.edge.indexer.getPoolIncentivesByAddresses.useQuery(
      {
        addresses: [address],
        interval: periodToNumber(aprTimeframe),
      },
      {
        select: (data) => {
          return data?.[address];
        },
      },
    );

  const { address: userAddress } = useAccount();
  const { showModal } = useModal();

  const [userPositionsKey, setUserPositionsKey] = useState(0);
  const reloadUserPositions = () => {
    setUserPositionsKey((prev) => prev + 1);
  };

  const [selectedUserAction, setSelectedUserAction] = useState<"" | "add-liquidity" | "swap">("");
  const toggleDuration = 300;
  const toggleUserAction = useCallback(
    (action: "add-liquidity" | "swap") => {
      setSelectedUserAction((prev) => {
        if (prev === action) {
          return "";
        }

        if (prev !== "") {
          setTimeout(() => {
            setSelectedUserAction(action);
          }, toggleDuration);

          return "";
        }

        return action;
      });
    },
    [setSelectedUserAction],
  );

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div>
        <BackButton text="Pools" returnToURL="/pools" />
      </div>

      {poolIsLoading && <PoolSkeleton />}
      {!poolIsLoading && pool && (
        <Fragment>
          <div className="flex flex-col lg:flex-row lg:space-x-14 space-y-6">
            <div className="flex-1 lg:p-4">
              <div className="flex items-center mb-4">
                <AssetsStacked assets={pool.assets} size="lg" />
                <h1 className="text-3xl">{pool.name}</h1>
              </div>
              <div className="flex flex-col lg:flex-row justify-between mb-8 items-center space-y-4 lg:space-y-0">
                <div className="flex flex-wrap gap-1">
                  <PoolTypePill poolType={pool.poolType} config={pool.config} />
                  <PoolFeePill poolType={pool.poolType} config={pool.config} />
                  {incentiveAprsIsLoading && <Skeleton className="h-8 w-3" />}
                  {!incentiveAprsIsLoading && <PoolIncentivesPill incentives={incentiveApr} />}
                </div>
                <div className="flex">
                  <PeriodToggle onChange={onAprTimeframeChange} defaultPeriod={aprTimeframe} />
                </div>
              </div>

              <div className="w-full flex-1 flex items-center justify-center border border-white/10 rounded-2xl p-4 lg:py-6 lg:px-10 flex-col mb-10">
                <div className="flex w-full space-x-4 justify-between">
                  <Metrics pool={pool} aprTimeframe={aprTimeframe} />
                </div>
              </div>
              <div className="border border-white/10 rounded-2xl p-6 lg:p-10">
                <Overview pool={pool} aprTimeframe={aprTimeframe} />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl mb-2">My Positions</h2>

              {!userAddress && (
                <div className="w-full flex items-center justify-between border border-white/10 p-4 rounded-3xl">
                  <p>Connect your wallet to see your position</p>
                  <Button onClick={() => showModal(ModalTypes.connect_wallet)}>
                    Connect Wallet
                  </Button>
                </div>
              )}
              {userAddress && (
                <UserPositions key={userPositionsKey} userAddress={userAddress} pool={pool} />
              )}

              <div className="flex gap-6 h-[42px] items-center mt-8 mb-4">
                <Button
                  variant={selectedUserAction === "add-liquidity" ? "solid" : "flat"}
                  size="lg"
                  onPress={() => {
                    toggleUserAction("add-liquidity");
                  }}
                >
                  Add Liquidity
                </Button>

                <Button
                  variant={selectedUserAction === "swap" ? "solid" : "flat"}
                  size="lg"
                  onPress={() => {
                    toggleUserAction("swap");
                  }}
                >
                  Swap
                </Button>
              </div>

              <div>
                <FadeInOut
                  isVisible={selectedUserAction === "add-liquidity"}
                  duration={toggleDuration}
                >
                  <ModalAddLiquidity
                    pool={pool}
                    successAction={() => {
                      setTimeout(reloadUserPositions, 2000);
                      client.invalidateQueries(["balances", address]);
                    }}
                    className="max-w-full"
                    classNameContainer="px-0"
                    WrapperComponent="div"
                    wrapperProps={{
                      className: "w-full",
                    }}
                  />
                </FadeInOut>
                <FadeInOut isVisible={selectedUserAction === "swap"} duration={toggleDuration}>
                  <Swap pool={pool} onSubmittedTx={() => refetchPool()} />
                </FadeInOut>
              </div>
            </div>
          </div>
        </Fragment>
      )}

      {!poolIsLoading && !pool && (
        <Fragment>
          <div className="flex flex-col gap-3 justify-center items-center lg:pl-3 lg:pr-2 pl-3">
            <h1 className="text-3xl">Pool not found</h1>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Pool;
