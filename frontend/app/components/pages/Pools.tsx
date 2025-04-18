"use client";
import Input from "../atoms/Input";
import { Button } from "../atoms/Button";
import { twMerge } from "~/utils/twMerge";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
import { trpc } from "~/trpc/client";

import type React from "react";
import PoolsSkeleton from "../molecules/skeletons/PoolsSkeleton";
import { CellPoolName } from "../atoms/cells/CellPoolName";
import { CellTVL } from "../atoms/cells/CellTVL";
import { CellData } from "../atoms/cells/CellData";
import { Table, TableRow } from "../atoms/Table";
import { useEffect, useState } from "react";
import { Pagination } from "../atoms/Pagination";
import { blockedPoolAddresses } from "~/utils/consts";
import type { PoolMetric } from "@towerfi/types";
import { CellVolume } from "../atoms/cells/CellVolume";

const Pools: React.FC = () => {
  const { showModal } = useModal();
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4";
  const { data: pools = [], isLoading } = trpc.local.pools.getPools.useQuery({
    limit: 100,
  });

  const [searchText, setSearchText] = useState("");
  const [aprTimeframe, setAprTimeframe] = useState<'1d' | '7d'>('7d');

  const columns = [
    { key: "name", title: "Pool", className: "col-span-2 lg:col-span-1" },
    { key: "poolLiquidity", title: "TVL" },
    { key: "apr", title: "APR" },
    { key: "volume", title: `Volume ${aprTimeframe === '1d' ? '24h' : '7d'}` },
    { key: "actions", title: "" },
  ];

  const filteredPools = pools
    .filter((pool) => !blockedPoolAddresses.includes(pool.poolAddress))
    .filter((pool) => pool.name.toLowerCase().includes(searchText.toLowerCase()));

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const [currentPage, setCurrentPage] = useState(0);
  const numberPerPage = 40;
  const totalPools = Math.ceil(filteredPools.length / numberPerPage);

  const sortedPools = [...filteredPools].sort(
    (a, b) => Number(b.poolLiquidity) - Number(a.poolLiquidity),
  );

  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - (aprTimeframe === '7d' ? 7 : 1));
  const {data: metrics, isLoading: isMetricLoading} = trpc.edge.indexer.getPoolMetricsByAddresses.useQuery({
    addresses: filteredPools.map((pool) => pool.poolAddress),
    startDate: startDate.toUTCString()
  })

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex gap-3 justify-between items-center lg:pl-3 lg:pr-2 pl-3">
        <h1 className="text-xl">Pools</h1>
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
        {isLoading && <PoolsSkeleton className={twMerge("grid", gridClass)} />}
        {sortedPools
          .slice(currentPage * numberPerPage, currentPage * numberPerPage + numberPerPage)
          .map((pool, i) => (
            <TableRow key={i} gridClass={twMerge("grid", gridClass)}>
              <CellPoolName
                assets={pool.assets}
                name={pool.name}
                poolType={pool.poolType}
                config={pool.config}
                className="w-full"
              />
              <CellTVL
                poolLiquidity={pool.poolLiquidity}
                poolAddress={pool.poolAddress}
                assets={pool.assets}
                className="w-full"
              />
              <CellData 
                title={`APR (${aprTimeframe})`} 
                data={isMetricLoading || !metrics ? "..." : ((metrics as Record<string, PoolMetric>)[pool.poolAddress]?.average_apr ? `${((metrics as Record<string, PoolMetric>)[pool.poolAddress].average_apr).toFixed(2)}%` : "0%")}
                className="w-full"
              />
              <CellVolume
                title={`Volume ${aprTimeframe === '1d' ? '24h' : '7d'}`}
                metrics={metrics?.[pool.poolAddress]}
                assets={pool.assets}
                timeframe={aprTimeframe}
                className="w-full"
              />
            {/*<CellData title="Fees 24h" /> */}
              <div className="flex items-end justify-end w-full">
                <Button
                  variant="flat"
                  onPress={() => showModal(ModalTypes.add_liquidity, false, { pool })}
                >
                  Add Liquidity
                </Button>
              </div>
            </TableRow>
          ))}
      </Table>
      {filteredPools.length > numberPerPage && (
        <Pagination
          total={totalPools}
          onPageChange={(page) => setCurrentPage(page - 1)}
          initialPage={currentPage + 1}
          className={{ base: "self-center backdrop-blur-xl rounded-3xl p-1" }}
        />
      )}
    </div>
  );
};

export default Pools;
