import type React from "react";
import { CellData } from "./CellData";
import Tooltip from "../Tooltip";
import type { PoolIncentive, PoolMetricSerialized } from "@towerfi/types";
import { useAPR } from "~/app/hooks/useAPR";

interface Props {
  title: string;
  metrics?: PoolMetricSerialized | null;
  incentives?: PoolIncentive | null;
  isLoading?: boolean;
  className?: string;
}

export const CellAprBreakDown: React.FC<{
  formattedApr: string;
  formattedIncentives: string;
  formatted_total_apr: string;
}> = ({ formattedApr, formattedIncentives, formatted_total_apr }) => {
  return (
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
};

const CellApr: React.FC<Props> = ({ title, metrics, incentives, isLoading, className }) => {
  const apr = useAPR(metrics, incentives);
  const formattedApr = isLoading || !metrics ? "..." : `${apr.fee_apr.toFixed(2)}%`;
  const formattedIncentives = isLoading ? "..." : `${apr.incentives_apr.toFixed(2)}%`;
  const formatted_total_apr = isLoading ? "..." : `${apr.total_apr.toFixed(2)}%`;

  const tooltipContent = (
    <CellAprBreakDown
      formattedApr={formattedApr}
      formattedIncentives={formattedIncentives}
      formatted_total_apr={formatted_total_apr}
    />
  );

  return (
    <CellData
      title={title}
      data={<Tooltip content={tooltipContent}>{formatted_total_apr}</Tooltip>}
      className={className}
    />
  );
};

export default CellApr;
