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
import { Table, TableRow } from "../atoms/Table";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Pagination } from "../atoms/Pagination";
import { blockedPoolAddresses } from "~/utils/consts";
import type { PoolMetricSerialized } from "@towerfi/types";
import { CellVolume } from "../atoms/cells/CellVolume";
import { CellPoints } from "../atoms/cells/CellPoints";
import { usePrices } from "~/app/hooks/usePrices";
import { convertMicroDenomToDenom } from "~/utils/intl";
import CellApr from "../atoms/cells/CellApr";
import { useRouter } from "next/navigation";
import { PeriodToggle, type Period } from "../atoms/PeriodToggle";

const Pools: React.FC = () => {
  const { showModal } = useModal();
  const { getPrice } = usePrices();
  const router = useRouter();
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4";
  const { data: pools = [], isLoading } = trpc.local.pools.getPools.useQuery({
    limit: 100,
  });

  const [searchText, setSearchText] = useState("");
  const [aprTimeframe, setAprTimeframe] = useState<Period>("7d");
  const onAprTimeframeChange = useCallback(
    (period: Period) => {
      setAprTimeframe(period);
    },
    [setAprTimeframe],
  );
  const [sortField, setSortField] = useState<"poolLiquidity" | "apr" | "volume">("poolLiquidity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const poolAddresses = useMemo(() => [...pools.map((pool) => pool.poolAddress)].sort(), [pools]);

  const startDate = useMemo(() => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (aprTimeframe === "7d" ? 7 : 1));
    return date.toUTCString();
  }, [aprTimeframe]);

  const queryInput = useMemo(
    () => ({
      addresses: poolAddresses,
      startDate,
    }),
    [poolAddresses, startDate],
  );

  const { data: metrics, isLoading: isMetricLoading } =
    trpc.edge.indexer.getPoolMetricsByAddresses.useQuery(queryInput, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: poolAddresses.length > 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const { data: incentiveAprs } = trpc.edge.indexer.getPoolIncentivesByAddresses.useQuery({
    addresses: poolAddresses,
    interval: aprTimeframe === "7d" ? 7 : 1,
  });

  // Calculate total APR including incentives
  const calculateTotalApr = (metric: PoolMetricSerialized | null | undefined, incentive: any) => {
    if (!metric) return 0;

    const swapApr = metric.average_apr || 0;
    const yearInSeconds = 31557600;
    const total_incentives = incentive?.rewards_per_second
      ? incentive.rewards_per_second * yearInSeconds
      : 0;
    const incentives_apr =
      incentive?.rewards_per_second && metric.tvl_usd
        ? (getPrice(
            convertMicroDenomToDenom(
              total_incentives || 0,
              incentive?.token_decimals || 0,
              incentive?.token_decimals || 0,
              false,
            ),
            incentive?.reward_token || "",
            { format: false },
          ) /
            metric.tvl_usd) *
          100
        : 0;

    return swapApr + incentives_apr;
  };

  const columns = [
    { key: "name", title: "Pool", className: "col-span-2 lg:col-span-1" },
    { key: "poolLiquidity", title: "TVL", sortable: true },
    { key: "apr", title: "APR", sortable: true },
    { key: "volume", title: `Volume ${aprTimeframe === "1d" ? "24h" : "7d"}`, sortable: true },
    { key: "points", title: "Points" },
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

  const sortedPools = [...filteredPools].sort((a, b) => {
    if (isMetricLoading || !metrics) {
      // Default sort by poolLiquidity when metrics aren't loaded
      return sortDirection === "desc"
        ? Number(b.poolLiquidity) - Number(a.poolLiquidity)
        : Number(a.poolLiquidity) - Number(b.poolLiquidity);
    }

    const metricA = metrics[a.poolAddress];
    const metricB = metrics[b.poolAddress];
    const incentiveA = incentiveAprs?.[a.poolAddress];
    const incentiveB = incentiveAprs?.[b.poolAddress];

    let valueA: number;
    let valueB: number;

    switch (sortField) {
      case "apr":
        valueA = calculateTotalApr(metricA, incentiveA);
        valueB = calculateTotalApr(metricB, incentiveB);
        break;
      // TODO once the token price is fetched from the indexer, use that to sort
      case "volume": {
        // Convert token0 volume to USD
        const token0VolumeA = getPrice(
          convertMicroDenomToDenom(
            metricA?.token0_swap_volume || 0,
            metricA?.token0_decimals || 0,
            metricA?.token0_decimals || 0,
            false,
          ),
          metricA?.token0_denom || "",
          { format: false },
        );
        const token0VolumeB = getPrice(
          convertMicroDenomToDenom(
            metricB?.token0_swap_volume || 0,
            metricB?.token0_decimals || 0,
            metricB?.token0_decimals || 0,
            false,
          ),
          metricB?.token0_denom || "",
          { format: false },
        );
        // Convert token1 volume to USD
        const token1VolumeA = getPrice(
          convertMicroDenomToDenom(
            metricA?.token1_swap_volume || 0,
            metricA?.token1_decimals || 0,
            metricA?.token1_decimals || 0,
            false,
          ),
          metricA?.token1_denom || "",
          { format: false },
        );
        const token1VolumeB = getPrice(
          convertMicroDenomToDenom(
            metricB?.token1_swap_volume || 0,
            metricB?.token1_decimals || 0,
            metricB?.token1_decimals || 0,
            false,
          ),
          metricB?.token1_denom || "",
          { format: false },
        );
        // Sum USD volumes
        valueA = token0VolumeA + token1VolumeA;
        valueB = token0VolumeB + token1VolumeB;
        break;
      }
      case "poolLiquidity":
        valueA = metricA?.tvl_usd || 0;
        valueB = metricB?.tvl_usd || 0;
        break;
      default:
        valueA = Number(a.poolLiquidity);
        valueB = Number(b.poolLiquidity);
    }

    return sortDirection === "desc" ? valueB - valueA : valueA - valueB;
  });

  const handleSort = (field: "poolLiquidity" | "apr" | "volume") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[120rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex gap-3 justify-between items-center lg:pl-3 lg:pr-2 pl-3">
        <h1 className="text-xl">Pools</h1>
        <div className="flex gap-3 h-[42px] items-center px-2">
          <PeriodToggle onChange={onAprTimeframeChange} defaultPeriod={aprTimeframe} />
          <Input
            isSearch
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns.map((col) => ({
          ...col,
          title: col.sortable ? (
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-white"
              onClick={() => handleSort(col.key as "poolLiquidity" | "apr" | "volume")}
            >
              {col.title}
              {col.sortable && sortField === col.key && (
                <span>{sortDirection === "desc" ? "↓" : "↑"}</span>
              )}
            </div>
          ) : (
            col.title
          ),
        }))}
        gridClass={gridClass}
      >
        {isLoading && <PoolsSkeleton className={twMerge("grid", gridClass)} />}
        {sortedPools
          .slice(currentPage * numberPerPage, currentPage * numberPerPage + numberPerPage)
          .map((pool, i) => (
            <TableRow
              key={i}
              gridClass={twMerge("grid cursor-pointer hover:bg-white/5", gridClass)}
              onClick={() => router.push(`/pools/${pool.poolAddress}`)}
            >
              <CellPoolName
                assets={pool.assets}
                name={pool.name}
                poolType={pool.poolType}
                config={pool.config}
                incentives={incentiveAprs?.[pool.poolAddress]}
                className="w-full pr-4"
              />
              <CellTVL
                poolLiquidity={pool.poolLiquidity}
                poolAddress={pool.poolAddress}
                assets={pool.assets}
                className="w-full pl-4"
              />
              <CellApr
                title={`APR (${aprTimeframe})`}
                metrics={metrics?.[pool.poolAddress]}
                incentives={incentiveAprs?.[pool.poolAddress]}
                isLoading={isMetricLoading}
                className="w-full px-4"
              />
              <CellVolume
                title={`Volume ${aprTimeframe === "1d" ? "24h" : "7d"}`}
                metrics={metrics?.[pool.poolAddress]}
                assets={pool.assets}
                timeframe={aprTimeframe}
                className="w-full px-4"
              />
              <CellPoints assets={pool.assets} poolType={pool.poolType} className="w-full px-1" />
              <div className="flex items-end justify-end w-full px-4">
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
