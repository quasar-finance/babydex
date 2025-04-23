import type React from "react";
import { CellData } from "./CellData";
import Tooltip from "../Tooltip";
import type { PoolIncentive, PoolMetric } from "@towerfi/types";
import { usePrices } from "~/app/hooks/usePrices";
import { convertMicroDenomToDenom } from "~/utils/intl";

interface Props {
  title: string;
  metrics?: PoolMetric | null;
  incentives?: PoolIncentive | null;
  isLoading?: boolean;
  className?: string;
}

const CellApr: React.FC<Props> = ({ title, metrics, incentives, isLoading, className }) => {

  const { getPrice } = usePrices();

  const apr = metrics?.average_apr || 0;
  const formattedApr = isLoading || !metrics ? "..." : `${apr.toFixed(2)}%`;

  const yearInSeconds = 31557600;
  const total_incentives = !isLoading && incentives?.rewards_per_second ? incentives.rewards_per_second * yearInSeconds : 0;
  const incentives_apr = !isLoading && incentives?.rewards_per_second && metrics?.tvl_usd ? 
    getPrice(
      convertMicroDenomToDenom(total_incentives || 0, incentives?.token_decimals || 0, incentives?.token_decimals || 0, false),
      incentives?.reward_token || '',
      { format: false }
    ) / metrics.tvl_usd * 100 : 0;
  const formattedIncentives = isLoading ? "..." : `${incentives_apr.toFixed(2)}%`;
  const total_apr = apr + incentives_apr;
  const formatted_total_apr = isLoading ? "..." : `${total_apr.toFixed(2)}%`;

  const tooltipContent = (
    <div className="flex flex-col gap-2 p-1">
      <div className="text-tw-orange-400">APR Breakdown</div>
      <div className="flex justify-between gap-4">
        <span className="text-white/50">Swap Fees</span>
        <span>{formattedApr}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-white/50">Incentives</span>
        <span>{formattedIncentives}</span>
      </div>
      <div className="h-[1px] bg-white/10" />
      <div className="flex justify-between gap-4">
        <span className="text-white/50">Net</span>
        <span>{formatted_total_apr}</span>
      </div>
    </div>
  );

  return (
    <CellData 
      title={title} 
      data={
        <Tooltip content={tooltipContent}>
          {formatted_total_apr}
        </Tooltip>
      } 
      className={className} 
    />
  );
};

export default CellApr;
