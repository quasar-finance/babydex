import { useAccount } from "@cosmi/react";
import type React from "react";
import { useModal } from "~/app/providers/ModalProvider";
import { trpc } from "~/trpc/client";
import { Table, TableRow } from "../../atoms/Table";
import PoolsDashboardSkeleton from "../../molecules/skeletons/PoolsDashboardSkeleton";
import { twMerge } from "~/utils/twMerge";
import { CellPoolName } from "../../atoms/cells/CellPoolName";
import { CellData } from "../../atoms/cells/CellData";
import { CellClaimRewards } from "../../atoms/cells/CellClaimRewards";
import { Popover, PopoverContent, PopoverTrigger } from "../../atoms/Popover";
import { Button } from "../../atoms/Button";
import { IconDots } from "@tabler/icons-react";
import { ModalTypes } from "~/types/modal";
import Link from "next/link";
import { CellDataToken } from "../../atoms/cells/CellDataToken";
import type { Asset, PoolInfo, UserPoolBalances } from "@towerfi/types";
import { useDexClient } from "~/app/hooks/useDexClient";

const columns = [
  { key: "name", title: "Pool" },
  { key: "apr", title: "APR" },
  { key: "staked", title: "Staked" },
  { key: "unstaked", title: "Unstaked" },
  { key: "claimableRewards", title: "Claimable Rewards" },
  { key: "actions", title: "" },
];

interface Props {
  pools: { poolInfo: PoolInfo; userBalance: UserPoolBalances; incentives: Asset[] }[];
  isLoading: boolean;
}

export const UserPools: React.FC<Props> = ({ pools, isLoading }) => {
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_4rem] gap-4";
  const { showModal } = useModal();
  const { address } = useAccount();

  if (!address) {
    return (
      <div className="w-full h-full flex items-center justify-between bg-white/10 p-4 rounded-3xl">
        <p>Connect your wallet to see your pools</p>
        <Button onClick={() => showModal(ModalTypes.connect_wallet)}>Connect Wallet</Button>
      </div>
    );
  }

  if (!pools.length && !isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-between bg-white/10 p-4 rounded-3xl">
        <p>You need to add liquidity first</p>
        <Button as={Link} href="/pools">
          Add liquidity
        </Button>
      </div>
    );
  }

  return (
    <Table columns={columns} gridClass={gridClass}>
      {isLoading && <PoolsDashboardSkeleton className={twMerge(gridClass)} />}
      {pools.map(({ poolInfo, userBalance, incentives }, i) => {
        return (
          <TableRow key={i} gridClass={twMerge("flex flex-wrap lg:grid ", gridClass)}>
            <CellPoolName
              assets={poolInfo.assets}
              name={poolInfo.name}
              poolType={poolInfo.poolType}
              config={poolInfo.config}
              className="order-1 col-span-1 w-[80%] lg:w-auto"
            />
            <CellData title="APR" data="-" className="order-3 w-[45%] lg:w-auto" />
            <CellDataToken
              title="Staked"
              poolAddress={poolInfo.poolAddress}
              amount={userBalance.staked_share_amount}
              tokens={poolInfo.assets}
              className="order-4 w-[45%] lg:w-auto"
            />
            <CellDataToken
              title="Unstaked"
              poolAddress={poolInfo.poolAddress}
              amount={userBalance.unstaked_share_amount}
              tokens={poolInfo.assets}
              className="order-5 w-[45%] lg:w-auto"
            />
            <CellClaimRewards
              rewards={incentives}
              poolToken={userBalance.lpToken}
              stakedAmount={userBalance.staked_share_amount}
              className="order-6 w-[45%] lg:w-auto"
            />
            <div className="order-2 lg:order-7 flex items-end justify-end w-fit lg:w-auto">
              <Popover triggerType="listbox">
                <PopoverTrigger>
                  <Button color="tertiary" radius="sm" size="icon" className="mt-4 lg:mt-0">
                    <IconDots className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[10rem] p-1">
                  <ul className="w-full">
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() =>
                        showModal(ModalTypes.stake_liquidity, false, {
                          pool: poolInfo,
                          balance: userBalance,
                        })
                      }
                    >
                      Stake
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() =>
                        showModal(ModalTypes.unstake_liquidity, false, {
                          pool: poolInfo,
                          balance: userBalance,
                        })
                      }
                    >
                      Unstake
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() => showModal(ModalTypes.add_liquidity, false, { pool: poolInfo })}
                    >
                      Add
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() =>
                        showModal(ModalTypes.remove_liquidity, false, {
                          pool: poolInfo,
                          balance: userBalance,
                        })
                      }
                    >
                      Remove
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </TableRow>
        );
      })}
    </Table>
  );
};
