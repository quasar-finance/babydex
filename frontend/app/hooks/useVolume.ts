import type { Currency, PoolIncentive, PoolMetricSerialized } from "@towerfi/types";
import { usePrices } from "./usePrices";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { DefaultPoolMetric } from "~/utils/consts";
import { useMemo } from "react";

export function useVolume(assets: Currency[], metrics?: PoolMetricSerialized | null) {
  if (metrics == null) {
    metrics = DefaultPoolMetric();
  }

  const { getPrice } = usePrices();
  const [token0, token1] = assets;

  const totalVolume = useMemo(() => {
    const token0Volume = convertMicroDenomToDenom(
      metrics.token0_swap_volume,
      token0.decimals,
      token0.decimals,
      false,
    );
    const token1Volume = convertMicroDenomToDenom(
      metrics.token1_swap_volume,
      token1.decimals,
      token1.decimals,
      false,
    );

    const token0Price = getPrice(token0Volume, token0.denom, { format: false });
    const token1Price = getPrice(token1Volume, token1.denom, { format: false });

    return token0Price + token1Price;
  }, [metrics, token0, token1, getPrice]);

  return totalVolume;
}
