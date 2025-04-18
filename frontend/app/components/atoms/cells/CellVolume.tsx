"use client";

import React from "react";
import { twMerge } from "~/utils/twMerge";
import { formatNumber, usePrices } from "~/app/hooks/usePrices";
import { convertMicroDenomToDenom } from "~/utils/intl";
import type { PoolMetric } from "@towerfi/types";
import type { Currency } from "@towerfi/types";

interface Props {
  title: string;
  metrics?: PoolMetric;
  assets: Currency[];
  className?: string;
  timeframe?: '1d' | '7d';
}

export const CellVolume: React.FC<Props> = ({ title, metrics, assets, className, timeframe = '7d' }) => {
  const { getPrice } = usePrices();
  const [token0, token1] = assets;

  const totalVolume = React.useMemo(() => {
    if (!metrics) return 0;

    const token0Volume = convertMicroDenomToDenom(
      metrics.token0_swap_volume,
      token0.decimals,
      token0.decimals,
      false
    );
    const token1Volume = convertMicroDenomToDenom(
      metrics.token1_swap_volume,
      token1.decimals,
      token1.decimals,
      false
    );

    const token0Price = getPrice(token0Volume, token0.denom, { format: false });
    const token1Price = getPrice(token1Volume, token1.denom, { format: false });

    return token0Price + token1Price;
  }, [metrics, token0, token1, getPrice]);

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">{`Volume ${timeframe === '7d' ? '7D' : '24h'}`}</p>
      <div className="flex items-center justify-between gap-3">
        <p>{metrics ? `${formatNumber(totalVolume, { currency: "USD", language: navigator.language })}` : "..."}</p>
      </div>
    </div>
  );
}; 