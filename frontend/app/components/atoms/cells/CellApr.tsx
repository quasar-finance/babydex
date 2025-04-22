import type React from "react";
import { CellData } from "./CellData";
import Tooltip from "../Tooltip";
import type { PoolMetric } from "@towerfi/types";

interface Props {
  title: string;
  metrics?: PoolMetric | null;
  isLoading?: boolean;
  className?: string;
}

const CellApr: React.FC<Props> = ({ title, metrics, isLoading, className }) => {
  const apr = metrics?.average_apr || 0;
  const formattedApr = isLoading || !metrics ? "..." : `${apr.toFixed(2)}%`;
  const formattedIncentives = isLoading || !metrics ? "..." : `${apr.toFixed(2)}%`;

  const tooltipContent = metrics ? (
    <div className="flex flex-col gap-2 p-1">
      <div className="text-tw-orange-400">APR Breakdown</div>
      <div className="flex justify-between">
        <span className="text-white/50">Pool Fee APR</span>
        <span>8.8%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">$BABY Incentives</span>
        <span>2.2%</span>
      </div>
      <div className="h-[1px] bg-white/10" />
      <div className="flex justify-between">
        <span className="text-white/50">Net APR (7d)</span>
        <span>9.2%</span>
      </div>
    </div>
  ) : null;

  return (
    <CellData 
      title={title} 
      data={
        metrics ? (
          <Tooltip content={tooltipContent}>
            {formattedApr}
          </Tooltip>
        ) : formattedApr
      } 
      className={className} 
    />
  );
};

export default CellApr;
