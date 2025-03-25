import { persist, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand";

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
