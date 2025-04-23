import type React from "react";
import AssetsStacked from "../AssetsStacked";
import Pill from "../Pill";
import type { PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";
import Tooltip from "../Tooltip";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { Assets } from "~/config";

interface PoolIncentive {
  lp_token_address: string;
  pool_address: string;
  reward_token: string;
  rewards_per_second: number;
  start_ts: string;
  end_ts: string;
  token_decimals: number;
  total_incentives: string;
}

interface Props extends Pick<PoolInfo, "assets" | "name" | "poolType" | "config"> {
  className?: string;
  incentives?: PoolIncentive;
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

export const CellPoolName: React.FC<Props> = ({ assets, name, poolType, config, className, incentives }) => {
  const tooltipContent = (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center gap-2">
        <div className="text-tw-orange-400 font-medium">Incentives</div>
        <a 
          href="https://docs.tower.fi/incentive-campaigns" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-sm"
        >
          View campaigns
        </a>
      </div>
      {incentives && (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-white/50">Current Campaigns:</div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/80">${Assets[incentives.reward_token]?.symbol || incentives.reward_token.toUpperCase()}</span>
              <span className="text-white/80 ml-2">
                {convertMicroDenomToDenom(
                  Number(incentives.rewards_per_second) * 60 * 60 * 24, // Convert to daily
                  incentives.token_decimals,
                  incentives.token_decimals,
                  true
                )}/day
              </span>
            </div>
            <div className="text-xs text-white/50">
              {new Date(Number(incentives.start_ts) * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} → {new Date(Number(incentives.end_ts) * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
          {!!incentives && (
            <Pill color="yellow">
              <Tooltip content={tooltipContent}>
                <div className="flex items-center gap-1">
                  Incentivized
                  <IconInfoCircleFilled className="w-4 h-4" />
                </div>
              </Tooltip>
            </Pill>
          )}
        </div>
      </div>
    </div>
  );
};
