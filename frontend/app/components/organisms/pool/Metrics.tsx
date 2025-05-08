import type { PoolInfo } from "@towerfi/types";
import { useTVL } from "~/app/hooks/useTVL";
import Skeleton from "../../atoms/Skeleton";
import { periodToNumber, type Period } from "../../atoms/PeriodToggle";
import { useAPR } from "~/app/hooks/useAPR";
import { trpc } from "~/trpc/client";
import { useMemo } from "react";
import { useVolume } from "~/app/hooks/useVolume";
import { formatNumber } from "~/app/hooks/usePrices";
import Tooltip from "../../atoms/Tooltip";
import { CellAprBreakDown } from "../../atoms/cells/CellApr";

export const Metrics: React.FC<{ pool: PoolInfo; aprTimeframe: Period }> = ({
  pool,
  aprTimeframe,
}) => {
  const {
    TVL,
    query: { isLoading: isTVLLoading },
  } = useTVL(pool);

  const startDate = useMemo(() => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - periodToNumber(aprTimeframe));

    return date.toUTCString();
  }, [aprTimeframe]);

  const queryInput = useMemo(
    () => ({
      addresses: [pool.poolAddress],
      startDate,
    }),
    [pool.poolAddress, startDate],
  );

  const { data: metrics, isLoading: isMetricsLoading } =
    trpc.edge.indexer.getPoolMetricsByAddresses.useQuery(queryInput, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (data) => {
        return data?.[pool.poolAddress];
      },
    });

  const { data: incentives, isLoading: isIncentivesLoading } =
    trpc.edge.indexer.getPoolIncentivesByAddresses.useQuery(
      {
        addresses: [pool.poolAddress],
        interval: periodToNumber(aprTimeframe),
      },
      {
        select: (data) => {
          return data?.[pool.poolAddress];
        },
      },
    );

  const apr = useAPR(metrics, incentives);
  const volume = useVolume(pool.assets, metrics);

  return (
    <>
      <div className="flex-1 flex flex-col space-y-4">
        <span className="text-white/50">TVL</span>
        {isTVLLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <span className="text-2xl text-white">
            {formatNumber(TVL, {
              currency: "USD",
              language: navigator.language,
            })}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col space-y-4">
        <span className="text-white/50">APR</span>
        {isMetricsLoading || isIncentivesLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <Tooltip
            content={
              <CellAprBreakDown
                formattedApr={apr.fee_apr.toFixed(2)}
                formattedIncentives={apr.incentives_apr.toFixed(2)}
                formatted_total_apr={apr.total_apr.toFixed(2)}
              />
            }
          >
            <span className="text-2xl text-white whitespace-nowrap">
              {apr?.total_apr.toFixed(2)} %
            </span>
          </Tooltip>
        )}
      </div>
      <div className="flex-1 flex flex-col space-y-4">
        <span className="text-white/50">Volume</span>
        {isMetricsLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <span className="text-2xl text-white">
            {formatNumber(volume, { currency: "USD", language: navigator.language })}
          </span>
        )}
      </div>
    </>
  );
};
