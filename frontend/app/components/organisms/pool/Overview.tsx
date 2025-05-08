import type { PoolInfo } from "@towerfi/types";
import { useSwapSimulation } from "~/app/hooks/useSwapSimulation";
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "~/utils/intl";
import Skeleton from "../../atoms/Skeleton";
import { CellPoints } from "../../atoms/cells/CellPoints";
import { trpc } from "~/trpc/client";
import { type Period, periodToNumber } from "../../atoms/PeriodToggle";
import { IncentivesOverview } from "./IncentivesOverview";
import { addressShorten } from "~/utils/masks";
import { IconCopy, IconExternalLink } from "@tabler/icons-react";
import { copyToClipboard } from "~/utils/browser";
import { useToast } from "~/app/hooks";

export const Overview: React.FC<{ pool: PoolInfo; aprTimeframe: Period }> = ({
  pool,
  aprTimeframe,
}) => {
  const swap = useSwapSimulation({
    poolAddress: pool.poolAddress,
    assets: pool.assets,
    amount: convertDenomToMicroDenom(1, pool.assets[0].decimals),
  });

  const { data: incentiveApr, isLoading: incentiveAprsIsLoading } =
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

  const { toast } = useToast();

  return (
    <div className="grid items-start grid-cols-[1fr] lg:grid-cols-[max-content_1fr] gap-y-2 lg:gap-y-8 gap-x-4">
      <span className="text-sm font-medium text-white/50">Price:</span>
      <span className="text-sm ">
        {swap.isLoading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          <span>
            1 {pool.assets[0].symbol} ={" "}
            {convertMicroDenomToDenom(swap.data?.return_amount, pool.assets[1].decimals, 2)}{" "}
            {pool.assets[1].symbol}
          </span>
        )}
      </span>

      <span className="text-sm font-medium text-white/50">Points:</span>
      <span className="text-sm ">
        <CellPoints assets={pool.assets} poolType={pool.poolType} />
      </span>

      {incentiveAprsIsLoading ? (
        <>
          <span className="text-sm font-medium text-white/50">Incentives:</span>
          <Skeleton className="h-4 w-1/2" />
        </>
      ) : incentiveApr ? (
        <>
          <span className="text-sm font-medium text-white/50">Incentives:</span>
          <IncentivesOverview incentives={incentiveApr} />
        </>
      ) : (
        <></>
      )}

      <span className="text-sm font-medium text-white/50">Pool Contract:</span>
      <span className="text-sm flex items-center">
        {addressShorten(pool.poolAddress)}
        <span
          className="ml-2 hover:cursor-pointer text-white/50 hover:text-white"
          onClick={() => {
            copyToClipboard(pool.poolAddress);
            console.log("Copied to clipboard", pool.poolAddress);
            toast.info(
              {
                description: "Copied to clipboard",
              },
              {
                removeDelay: 100,
              },
            );
          }}
        >
          <IconCopy />
        </span>
        <a
          href={"https://www.mintscan.io/babylon/wasm/contract/" + pool.poolAddress}
          className="ml-2 hover:cursor-pointer text-white/50 hover:text-white"
          target="_blank"
          rel="noreferrer"
        >
          <IconExternalLink />
        </a>
      </span>
    </div>
  );
};
