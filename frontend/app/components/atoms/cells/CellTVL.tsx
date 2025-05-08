"use client";

import type React from "react";
import type { PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";
import { useTVL } from "~/app/hooks/useTVL";
import { formatNumber } from "~/app/hooks/usePrices";

interface Props extends Pick<PoolInfo, "poolLiquidity" | "poolAddress" | "assets"> {
  className?: string;
}

export const CellTVL: React.FC<Props> = ({ poolLiquidity, poolAddress, assets, className }) => {
  const {
    TVL,
    query: { isLoading: isTVLLoading },
  } = useTVL({ poolLiquidity, poolAddress, assets });

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">TVL</p>
      <div className="flex items-center  justify-between gap-3">
        <p>
          {isTVLLoading
            ? "loading"
            : formatNumber(TVL, {
                currency: "USD",
                language: navigator.language,
              })}
        </p>
      </div>
    </div>
  );
};
