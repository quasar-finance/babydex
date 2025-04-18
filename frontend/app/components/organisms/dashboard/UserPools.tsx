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
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useState } from "react";
import type { PoolMetric } from "@towerfi/types";
import Input from "../../atoms/Input";

const columns = [
  { key: "name", title: "Pool" },
  { key: "deposit", title: "Total Value" },
  { key: "apr", title: "APR" },
  /*  { key: "unstaked", title: "Unstaked" }, */
  { key: "claimableIncentives", title: "Claimable Incentives" },
  { key: "actions", title: "" },
];

interface Props {
  pools: { poolInfo: PoolInfo; userBalance: UserPoolBalances; incentives: Asset[] }[];
  isLoading: boolean;
  refreshUserPools?: () => void;
}

export const UserPools: React.FC<Props> = ({ pools, isLoading, refreshUserPools }) => {
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_8rem] gap-4";
  const { showModal } = useModal();
  const { address } = useAccount();
  const [aprTimeframe, setAprTimeframe] = useState<'1d' | '7d'>('7d');
  const [searchText, setSearchText] = useState("");

  const filteredPools = pools.filter(({ poolInfo }) => 
    poolInfo.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - (aprTimeframe === '7d' ? 7 : 1));
  const {data: metrics, isLoading: isMetricLoading} = trpc.edge.indexer.getPoolMetricsByAddresses.useQuery({
    addresses: filteredPools.map(({ poolInfo }) => poolInfo.poolAddress),
    startDate: startDate.toUTCString()
  });

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
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 justify-between items-center lg:pl-3 lg:pr-2 pl-3">
        <h1 className="text-xl">Your Pools</h1>
        <div className="flex gap-3 h-[42px] items-center px-2">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setAprTimeframe('1d')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                aprTimeframe === '1d' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              1D
            </button>
            <button
              onClick={() => setAprTimeframe('7d')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                aprTimeframe === '7d' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              7D
            </button>
          </div>
          <Input
            isSearch
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <Table columns={columns} gridClass={gridClass}>
        {isLoading && <PoolsDashboardSkeleton className={twMerge(gridClass)} />}
        {filteredPools
          .sort((a, b) =>
            BigInt(a.userBalance.staked_share_amount) < BigInt(b.userBalance.staked_share_amount)
              ? 1
              : -1,
          )
          .map(({ poolInfo, userBalance, incentives }, i) => {
            return (
              <TableRow key={i} gridClass={twMerge("flex flex-wrap lg:grid ", gridClass)}>
                <CellPoolName
                  assets={poolInfo.assets}
                  name={poolInfo.name}
                  poolType={poolInfo.poolType}
                  config={poolInfo.config}
                  className="order-1 col-span-1 w-[80%] lg:w-auto"
                />
                <CellDataToken
                  title="Staked"
                  poolAddress={poolInfo.poolAddress}
                  amount={userBalance.staked_share_amount}
                  tokens={poolInfo.assets}
                  className="order-3 w-[45%] lg:w-auto"
                />
                <CellData 
                  title={`APR (${aprTimeframe})`} 
                  data={isMetricLoading || !metrics ? "..." : ((metrics as Record<string, PoolMetric>)[poolInfo.poolAddress]?.average_apr ? `${((metrics as Record<string, PoolMetric>)[poolInfo.poolAddress].average_apr).toFixed(2)}%` : "0%")}
                  className="order-4 w-[45%] lg:w-auto" 
                />
                <CellClaimRewards
                  rewards={incentives}
                  poolToken={userBalance.lpToken}
                  stakedAmount={userBalance.staked_share_amount}
                  className="order-6 w-[45%] lg:w-auto"
                />
                <div className="order-2 lg:order-7 flex items-end justify-end w-fit lg:w-auto">
                  <Menu>
                    <MenuButton className="mt-4 lg:mt-0">
                      <IconDots className="w-6 h-6" />
                    </MenuButton>

                    <MenuItems
                      transition
                      className="min-w-[10rem] p-1 z-20 bg-tw-bg border border-white/10 rounded-lg"
                      anchor="bottom end"
                    >
                      <MenuItem>
                        <button
                          type="button"
                          className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                          onClick={() =>
                            showModal(ModalTypes.add_liquidity, false, {
                              pool: poolInfo,
                              refreshUserPools,
                            })
                          }
                        >
                          Add
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type="button"
                          className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                          onClick={() =>
                            showModal(ModalTypes.remove_liquidity, false, {
                              pool: poolInfo,
                              balance: userBalance,
                              refreshUserPools,
                            })
                          }
                        >
                          Remove
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </TableRow>
            );
          })}
      </Table>
    </div>
  );
};
