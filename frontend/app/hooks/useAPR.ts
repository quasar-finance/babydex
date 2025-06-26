import type { PoolIncentive, PoolMetricSerialized } from "@towerfi/types";
import { usePrices } from "./usePrices";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { DefaultPoolIncentive, DefaultPoolMetric } from "~/utils/consts";

const yearInSeconds = 31557600;

export type APRResult = {
  fee_apr: number;
  incentives_apr: number;
  total_apr: number;
};

export function useAPR(
  metrics?: PoolMetricSerialized | null,
  incentives?: PoolIncentive | PoolIncentive[] | null,
): APRResult {
  if (metrics == null) {
    metrics = DefaultPoolMetric();
  }

  const { getPrice } = usePrices();

  const fee_apr = metrics.average_apr * 100;
  let incentives_apr = 0;

  // Handle both single incentive and array of incentives
  const incentiveArray = incentives 
    ? Array.isArray(incentives) 
      ? incentives 
      : [incentives]
    : [];

  // Calculate total APR from all incentives
  for (const incentive of incentiveArray) {
    const total_incentives = incentive.rewards_per_second * yearInSeconds;
    
    if (total_incentives > 0) {
      const price = getPrice(
        convertMicroDenomToDenom(
          total_incentives,
          incentive.token_decimals,
          incentive.token_decimals,
          false,
        ),
        incentive.reward_token,
        { format: false },
      );

      if (price > 0 && metrics.tvl_usd > 0) {
        incentives_apr += (price / metrics.tvl_usd) * 100;
      }
    }
  }

  return {
    fee_apr,
    incentives_apr,
    total_apr: fee_apr + incentives_apr,
  };
}
