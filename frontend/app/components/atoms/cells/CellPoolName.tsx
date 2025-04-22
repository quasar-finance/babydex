import type React from "react";
import AssetsStacked from "../AssetsStacked";
import Pill from "../Pill";
import type { PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";

interface Props extends Pick<PoolInfo, "assets" | "name" | "poolType" | "config"> {
  className?: string;
  incentivized?: boolean,
}

const getPoolTypeDescription = (poolType: string, params?: any) => {
  if (poolType === "concentrated") {
    if (!params) return "PCL";

    const amp = params.amp;
    const gamma = params.gamma;

    if (amp && gamma) {
      if (amp == 12) {
        return "PCL Wide";
      }
      if (amp == 75) {
        return "PCL Narrow";
      }
      if (amp == 950) {
        return "PCL Correlated";
      }
      return `PCL Custom ${amp}/${gamma}`;
    }

    return "PCL";
  }

  return poolType.toUpperCase();
};

export const CellPoolName: React.FC<Props> = ({ assets, name, poolType, config, className, incentivized }) => {
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
        <Pill color={poolType === "xyk" ? "green" : "blue"}>
          {getPoolTypeDescription(poolType, config.params)}
        </Pill>
        <Pill>
          {
            poolType === "concentrated"
              ? `${(Number(config.params.mid_fee || 0) * 100).toFixed(2)}% - ${(Number(config.params.out_fee || 0) * 100).toFixed(2)}%`
              : "0.30%" // TODO make this dynamic after launch
          }
        </Pill>
        <div className="flex items-center gap-2">
          {incentivized && (
            <Pill color="yellow">
              Incentivized
            </Pill>
          )}
        </div>
      </div>
    </div>
  );
};
