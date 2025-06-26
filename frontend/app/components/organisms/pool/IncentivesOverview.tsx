import type { PoolIncentive } from "@towerfi/types";
import { Assets } from "~/config";
import { convertMicroDenomToDenom } from "~/utils/intl";
import AssetsStacked from "../../atoms/AssetsStacked";

export const IncentivesOverview: React.FC<{ incentives: PoolIncentive | PoolIncentive[] }> = ({ incentives }) => {
  const incentiveArray = Array.isArray(incentives) ? incentives : [incentives];
  
  return (
    <div className="flex flex-col gap-3">
      {incentiveArray.map((incentive, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/80 flex gap-1 items-center">
              <AssetsStacked assets={[Assets[incentive.reward_token]]} size="sm" />$
              {Assets[incentive.reward_token]?.symbol || incentive.reward_token.toUpperCase()}
            </span>
            <span className="text-white/80 ml-2">
              {convertMicroDenomToDenom(
                Number(incentive.rewards_per_second) * 60 * 60 * 24, // Convert to daily
                incentive.token_decimals,
                2,
                true,
              )}
              /day
            </span>
            <div className="text-xs text-white/50">
              {new Date(Number(incentive.start_ts) * 1000).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}{" "}
              →{" "}
              {new Date(Number(incentive.end_ts) * 1000).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </div>
      ))}
      <a
        href="https://docs.tower.fi/incentive-campaigns"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline text-xs mt-2"
      >
        View campaigns
      </a>
    </div>
  );
};
