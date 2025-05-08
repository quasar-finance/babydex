import type { PoolInfo } from "@towerfi/types";
import { useMemo } from "react";
import { trpc } from "~/trpc/client";
import Skeleton from "../../atoms/Skeleton";
import { useModal } from "~/app/providers/ModalProvider";
import { Button } from "../../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { IconRefresh } from "@tabler/icons-react";
import { CellDataToken } from "../../atoms/cells/CellDataToken";
import { CellClaimRewards } from "../../atoms/cells/CellClaimRewards";
import clsx from "clsx";

export const UserPositions: React.FC<{
  userAddress: string;
  pool: PoolInfo;
}> = ({ userAddress, pool }) => {
  const {
    data: userPools = [],
    isLoading: isUserPoolLoading,
    isRefetching: isUserPoolRefetching,
    refetch: refetchUserPools,
  } = trpc.local.pools.getUserPools.useQuery({
    address: userAddress,
  });

  const usersPosition = useMemo(
    () =>
      userPools.find((userPool) => {
        return userPool.poolInfo.poolAddress === pool.poolAddress;
      }),
    [userPools],
  );

  const { showModal } = useModal();

  const refreshButton = useMemo(
    () => (
      <button
        type="button"
        onClick={() => {
          if (isUserPoolRefetching) {
            return;
          }

          refetchUserPools();
        }}
      >
        <IconRefresh
          size={20}
          className={clsx(
            "text-tw-orange-400 transition-transform-colors",
            isUserPoolRefetching && "animate-[spin_1.5s_linear_infinite_reverse] text-white/50",
          )}
        />
      </button>
    ),
    [isUserPoolRefetching, refetchUserPools],
  );

  return (
    <>
      <div className="p-4 text-sm text-white/50 hidden lg:flex">
        <div className="flex-1">Total Value</div>
        <div className="flex-1">Claimable Incentives</div>
        <div className="flex-1"></div>
      </div>

      <div className="flex-col flex lg:flex-row lg:space-y-0 space-y-4 items-center flex-wrap border border-white/10 p-4 rounded-xl">
        {isUserPoolLoading && <Skeleton className="h-8 w-full" />}
        {!isUserPoolLoading && !usersPosition && (
          <div className="flex items-center justify-between w-full h-full">
            <p className="text-white/75">No positions found</p>
            {refreshButton}
          </div>
        )}
        {!isUserPoolLoading && usersPosition && (
          <>
            <div className="flex-1">
              <CellDataToken
                title="Total Value"
                poolAddress={pool.poolAddress}
                amount={usersPosition.userBalance.staked_share_amount}
                tokens={pool.assets}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <CellClaimRewards
                title="Claimable Incentives"
                rewards={usersPosition.incentives}
                poolToken={usersPosition.userBalance.lpToken}
                stakedAmount={usersPosition.userBalance.staked_share_amount}
                className="w-full"
              />
            </div>
            <div className="flex-1 md:w-26 items-center flex lg:justify-end gap-2">
              {refreshButton}
              <Button
                variant="flat"
                onPress={() => {
                  showModal(ModalTypes.remove_liquidity, false, {
                    pool,
                    balance: usersPosition.userBalance,
                    refreshUserPools: () => setTimeout(() => refetchUserPools(), 2000),
                  });
                }}
              >
                Remove
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
