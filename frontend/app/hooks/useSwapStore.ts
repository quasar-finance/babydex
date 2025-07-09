import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type State = {
  slippage: string;
  setSlippage: (slippage: string) => void;
};

export const useSwapStore = create(
  subscribeWithSelector(
    persist<State>(
      (set, get) => ({
        slippage: "auto",
        setSlippage: (slippage: string) => set({ slippage }),
      }),
      {
        name: "tower.swap",
      },
    ),
  ),
);
