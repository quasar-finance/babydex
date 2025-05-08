import type React from "react";
import AssetsStacked from "../AssetsStacked";
import type { PoolIncentive, PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";
import { PoolFeePill, PoolIncentivesPill, PoolTypePill } from "../PoolPill";

interface Props extends Pick<PoolInfo, "assets" | "name" | "poolType" | "config"> {
  className?: string;
  incentives?: PoolIncentive;
}

export const CellPoolName: React.FC<Props> = ({
  assets,
  name,
  poolType,
  config,
  className,
  incentives,
}) => {
  return (
    <div className={twMerge("col-span-2 lg:col-span-1 flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">Pool</p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <AssetsStacked assets={assets} />
          <span>{name}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <PoolTypePill poolType={poolType} config={config} />
        <PoolFeePill poolType={poolType} config={config} />
        <PoolIncentivesPill incentives={incentives} />
      </div>
    </div>
  );
};
