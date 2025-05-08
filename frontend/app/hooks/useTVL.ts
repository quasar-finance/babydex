import type { PoolInfo } from "@towerfi/types";
import { useWithdrawSimulation } from "./useWithdrawSimulation";
import { usePrices } from "./usePrices";
import { useMemo } from "react";
import { convertMicroDenomToDenom } from "~/utils/intl";

export function useTVL({
  poolLiquidity,
  poolAddress,
  assets,
}: Pick<PoolInfo, "poolLiquidity" | "poolAddress" | "assets">) {
  const { simulation, query } = useWithdrawSimulation({
    poolAddress,
    assets,
    amount: poolLiquidity,
  });

  const { getPrice } = usePrices();

  const TVL = useMemo(() => {
    if (!simulation) return 0;

    const [token0, token1] = simulation;
    const token0Price = getPrice(
      convertMicroDenomToDenom(token0.amount, token0.decimals, token0.decimals, false),
      token0.denom,
      { format: false },
    );
    const token1Price = getPrice(
      convertMicroDenomToDenom(token1.amount, token1.decimals, token1.decimals, false),
      token1.denom,
      { format: false },
    );

    return token0Price + token1Price;
  }, [simulation]);

  return {
    TVL,
    query,
    simulation,
  };
}
