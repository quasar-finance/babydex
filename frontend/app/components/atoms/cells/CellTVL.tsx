"use client";

import type React from "react";
import AssetsStacked from "../AssetsStacked";
import Pill from "../Pill";
import type { PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { useWithdrawSimulation } from "~/app/hooks/useWithdrawSimulation";
import { formatNumber, usePrices } from "~/app/hooks/usePrices";
import { useMemo } from "react";

interface Props extends Pick<PoolInfo, "poolLiquidity" | "poolAddress" | "assets"> {
  className?: string;
}

export const CellTVL: React.FC<Props> = ({ poolLiquidity, poolAddress, assets, className }) => {
  const {
    simulation,
    query: { isLoading: isSimulateLoading },
  } = useWithdrawSimulation({ poolAddress, assets, amount: poolLiquidity });

  const { getPrice } = usePrices();

  const tvl = useMemo(() => {
    if (!simulation) return null;
    const [token0, token1] = simulation;
    const token0Price = getPrice(
      convertMicroDenomToDenom(token0.amount, token0.decimals),
      token0.denom,
      { format: false },
    );
    const token1Price = getPrice(
      convertMicroDenomToDenom(token1.amount, token1.decimals),
      token1.denom,
      { format: false },
    );
    return formatNumber(token0Price + token1Price, {
      currency: "USD",
      language: navigator.language,
    });
  }, []);

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">TVL</p>
      <div className="flex items-center  justify-between gap-3">
        <p>{tvl ? tvl : "loading"}</p>
      </div>
    </div>
  );
};
