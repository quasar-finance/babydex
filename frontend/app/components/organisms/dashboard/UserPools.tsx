import { useAccount } from "@cosmi/react";
import type React from "react";
import { useModal } from "~/app/providers/ModalProvider";
import { trpc } from "~/trpc/client";
import { Table, TableRow } from "../../atoms/Table";
import PoolsDashboardSkeleton from "../../molecules/skeletons/PoolsDashboardSkeleton";
import { twMerge } from "~/utils/twMerge";
import { CellPoolName } from "../../atoms/cells/CellPoolName";
import { CellClaimRewards } from "../../atoms/cells/CellClaimRewards";
import { Button } from "../../atoms/Button";
import { IconDots } from "@tabler/icons-react";
import { ModalTypes } from "~/types/modal";
import Link from "next/link";
import { CellDataToken } from "../../atoms/cells/CellDataToken";
import type { Asset, PoolInfo, UserPoolBalances } from "@towerfi/types";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useState, useMemo } from "react";
import Input from "../../atoms/Input";
import { CellVolume } from "../../atoms/cells/CellVolume";
import { CellPoints } from "../../atoms/cells/CellPoints";
import { useRouter } from "next/navigation";
import CellApr from "../../atoms/cells/CellApr";
import { PeriodToggle, type Period } from "../../atoms/PeriodToggle";

interface Props {
  pools: { poolInfo: PoolInfo; userBalance: UserPoolBalances; incentives: Asset[] }[];
  isLoading: boolean;
  refreshUserPools?: () => void;
}

export const UserPools: React.FC<Props> = ({ pools, isLoading, refreshUserPools }) => {
  const gridClass = "grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_8rem] gap-4";
  const { showModal } = useModal();
  const { address } = useAccount();
  const router = useRouter();
  const [aprTimeframe, setAprTimeframe] = useState<Period>("7d");
  const [searchText, setSearchText] = useState("");

  const columns = [
    { key: "name", title: "Pool" },
    { key: "deposit", title: "Total Value" },
    { key: "apr", title: "APR" },
    { key: "volume", title: `Volume ${aprTimeframe === "1d" ? "24h" : "7d"}` },
    { key: "points", title: "Points" },
    { key: "claimableIncentives", title: "Claimable Incentives" },
    { key: "actions", title: "" },
  ];

  const filteredPools = pools.filter(({ poolInfo }) =>
    poolInfo.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const startDate = useMemo(() => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (aprTimeframe === "7d" ? 7 : 1));
    return date.toUTCString();
  }, [aprTimeframe]);

  const poolAddresses = useMemo(() => 
    filteredPools.map(({ poolInfo }) => poolInfo.poolAddress),
    [filteredPools]
  );

  const queryInput = useMemo(
    () => ({
      addresses: poolAddresses,
      startDate,
    }),
    [poolAddresses, startDate],
  );
  
  const { data: metrics, isLoading: isMetricLoading } =
    trpc.edge.indexer.getPoolMetricsByAddresses.useQuery(queryInput, {
      enabled: poolAddresses.length > 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 1, // 1 minute
    });

  const { data: incentiveAprs } = trpc.edge.indexer.getPoolIncentivesByAddresses.useQuery({
    addresses: poolAddresses,
    interval: aprTimeframe === "7d" ? 7 : 1,
  }, {
    enabled: poolAddresses.length > 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 1, // 1 minutes
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
          <PeriodToggle onChange={setAprTimeframe} defaultPeriod={aprTimeframe} />
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
              <TableRow
                key={i}
                gridClass={twMerge("grid cursor-pointer hover:bg-white/5", gridClass)}
                onClick={() => router.push(`/pools/${poolInfo.poolAddress}`)}
              >
                <CellPoolName
                  assets={poolInfo.assets}
                  name={poolInfo.name}
                  poolType={poolInfo.poolType}
                  config={poolInfo.config}
                  incentives={incentiveAprs?.[poolInfo.poolAddress]}
                  className="w-full pr-4"
                />
                <CellDataToken
                  title="Staked"
                  poolAddress={poolInfo.poolAddress}
                  amount={userBalance.staked_share_amount}
                  tokens={poolInfo.assets}
                  className="w-full pl-4"
                />
                <CellApr
                  title={`APR (${aprTimeframe})`}
                  metrics={metrics?.[poolInfo.poolAddress]}
                  incentives={incentiveAprs?.[poolInfo.poolAddress]}
                  isLoading={isMetricLoading}
                  className="w-full px-4"
                />
                <CellVolume
                  title={`Volume ${aprTimeframe === "1d" ? "24h" : "7d"}`}
                  metrics={metrics?.[poolInfo.poolAddress]}
                  assets={poolInfo.assets}
                  timeframe={aprTimeframe}
                  className="w-full px-4"
                />
                <CellPoints
                  assets={poolInfo.assets}
                  poolType={poolInfo.poolType}
                  className="w-full px-4"
                />
                <CellClaimRewards
                  rewards={incentives}
                  poolToken={userBalance.lpToken}
                  stakedAmount={userBalance.staked_share_amount}
                  className="w-full px-4"
                />
                <div
                  className="flex items-end justify-end w-full px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Menu>
                    <MenuButton>
                      <IconDots className="w-6 h-6" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-lg z-50">
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
