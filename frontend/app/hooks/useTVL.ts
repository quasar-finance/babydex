import type { PoolInfo } from "@towerfi/types";
import { useWithdrawSimulation } from "./useWithdrawSimulation";
import { usePrices } from "./usePrices";
import { useEffect, useMemo } from "react";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { create } from "zustand";

interface PoolTVLRecordStore {
  records: Record<string, number>;
  setRecord: (poolAddress: string, value: number) => void;
  getRecord: (poolAddress: string) => number | undefined;
  deleteRecord: (poolAddress: string) => void;
}

export const usePoolTVLRecordStore = create<PoolTVLRecordStore>((set, get) => ({
  records: {},
  setRecord: (poolAddress, value) => {
    set((state) => ({
      records: {
        ...state.records,
        [poolAddress]: value,
      },
    }));
  },
  getRecord: (poolAddress) => {
    return get().records[poolAddress];
  },
  deleteRecord: (poolAddress) =>
    set((state) => {
      const { [poolAddress]: deleted, ...rest } = state.records;
      return { records: rest };
    }),
}));

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
  const { setRecord } = usePoolTVLRecordStore();

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

    const tvl = token0Price + token1Price;
    return tvl;
  }, [simulation, getPrice, poolAddress]);

  useEffect(() => {
    setRecord(poolAddress, TVL);
  }, [TVL, poolAddress]);

  return {
    TVL,
    query,
    simulation,
  };
}
