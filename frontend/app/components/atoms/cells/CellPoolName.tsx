import type React from "react";
import AssetsStacked from "../AssetsStacked";
import Pill from "../Pill";
import type { PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";
interface Props extends Pick<PoolInfo, "assets" | "name" | "poolType" | "config"> {
  className?: string;
}

export const CellPoolName: React.FC<Props> = ({ assets, name, poolType, config, className }) => {
  return (
    <div className={twMerge("col-span-2 lg:col-span-1 flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">Pool</p>
      <div className="flex items-center  justify-between gap-3">
        <div className="flex items-center gap-3">
          <AssetsStacked assets={assets} />
          <span>{name}</span>
        </div>
        <div className="flex gap-1 items-center">
          <Pill>{config.params.fee_gamma || 0}%</Pill>
          <Pill color={poolType === "xyk" ? "green" : "blue"} className="uppercase">
            {poolType.replace("concentrated", "pcl")}
          </Pill>
        </div>
      </div>
    </div>
  );
};
