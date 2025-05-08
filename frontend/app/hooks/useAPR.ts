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
  incentives?: PoolIncentive | null,
): APRResult {
  if (metrics == null) {
    metrics = DefaultPoolMetric();
  }

  if (incentives == null) {
    incentives = DefaultPoolIncentive();
  }

  const { getPrice } = usePrices();

  const fee_apr = metrics.average_apr * 100;
  const total_incentives = incentives.rewards_per_second * yearInSeconds;
  let incentives_apr = 0;

  if (total_incentives > 0) {
    const price = getPrice(
      convertMicroDenomToDenom(
        total_incentives,
        incentives.token_decimals,
        incentives.token_decimals,
        false,
      ),
      incentives.reward_token,
      { format: false },
    );

    if (price > 0) {
      incentives_apr = (price / metrics.tvl_usd) * 100;
    }
  }

  return {
    fee_apr,
    incentives_apr,
    total_apr: fee_apr + incentives_apr,
  };
}
