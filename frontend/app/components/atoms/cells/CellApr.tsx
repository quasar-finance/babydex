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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span>Total APR: </span>
        <span> {formattedApr}</span>
      </div>
      <div className="flex justify-between">
        <span>Swap APR: </span>
        <span> {formattedApr}</span>
      </div>
      <div className="flex justify-between">
        <span>Fees APR: </span>
        <span> {formattedIncentives}</span>
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
