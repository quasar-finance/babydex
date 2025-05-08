import { IconInfoCircleFilled } from "@tabler/icons-react";
import type { PoolIncentive, PoolInfo } from "@towerfi/types";
import Pill from "./Pill";
import Tooltip from "./Tooltip";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { Assets } from "~/config";
import { twMerge } from "~/utils/twMerge";

export const getPoolTypeDescription = (poolType: string, params?: PoolInfo["config"]["params"]) => {
  if (poolType === "concentrated") {
    if (!params) return "PCL";

    const amp = params.amp;
    const gamma = params.gamma;

    if (amp && gamma) {
      if (amp === "12") {
        return "PCL Wide";
      }
      if (amp === "75") {
        return "PCL Narrow";
      }
      if (amp === "950") {
        return "PCL Correlated";
      }
      return `PCL Custom ${amp}/${gamma}`;
    }

    return "PCL";
  }

  return poolType.toUpperCase();
};

export const PoolTypePill: React.FC<{
  poolType: string;
  config: PoolInfo["config"];
}> = ({ poolType, config }) => {
  return (
    <Pill color={poolType === "xyk" ? "green" : "blue"}>
      {getPoolTypeDescription(poolType, config.params)}
    </Pill>
  );
};

export const PoolFeePill: React.FC<{
  poolType: string;
  config: PoolInfo["config"];
}> = ({ poolType, config }) => {
  return (
    <Pill>
      {
        poolType === "concentrated"
          ? `${(Number(config.params.mid_fee || 0) * 100).toFixed(2)}% - ${(Number(config.params.out_fee || 0) * 100).toFixed(2)}%`
          : "0.30%" // TODO make this dynamic after launch
      }
    </Pill>
  );
};

export const PoolIncentivesPill: React.FC<{
  incentives: PoolIncentive | undefined;
  className?: string;
}> = ({ incentives, className }) => {
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
              <span className="text-white/80">
                ${Assets[incentives.reward_token]?.symbol || incentives.reward_token.toUpperCase()}
              </span>
              <span className="text-white/80 ml-2">
                {convertMicroDenomToDenom(
                  Number(incentives.rewards_per_second) * 60 * 60 * 24, // Convert to daily
                  incentives.token_decimals,
                  incentives.token_decimals,
                  true,
                )}
                /day
              </span>
            </div>
            <div className="text-xs text-white/50">
              {new Date(Number(incentives.start_ts) * 1000).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}{" "}
              →{" "}
              {new Date(Number(incentives.end_ts) * 1000).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={twMerge("flex items-center gap-2", className)}>
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
  );
};
