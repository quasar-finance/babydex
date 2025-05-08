"use client";

import type React from "react";
import { twMerge } from "~/utils/twMerge";
import { formatNumber } from "~/app/hooks/usePrices";
import type { PoolMetricSerialized } from "@towerfi/types";
import type { Currency } from "@towerfi/types";
import type { Period } from "../PeriodToggle";
import { useVolume } from "~/app/hooks/useVolume";

interface Props {
  title: string;
  metrics?: PoolMetricSerialized;
  assets: Currency[];
  className?: string;
  timeframe?: Period;
}

export const CellVolume: React.FC<Props> = ({ metrics, assets, className, timeframe = "7d" }) => {
  const volume = useVolume(assets, metrics);

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">{`Volume ${timeframe === "7d" ? "7D" : "24h"}`}</p>
      <div className="flex items-center justify-between gap-3">
        <p>
          {metrics
            ? `${formatNumber(volume, { currency: "USD", language: navigator.language })}`
            : "..."}
        </p>
      </div>
    </div>
  );
};
