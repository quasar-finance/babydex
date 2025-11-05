import { persist, subscribeWithSelector } from 'zustand/middleware';
import { create } from 'zustand';

type State = {
  slippage: string;
  setSlippage: (slippage: string) => void;
};

export const useSwapStore = create(
  subscribeWithSelector(
    persist<State>(
      (set, get) => ({
        slippage: 'auto',
        setSlippage: (slippage: string) => set({ slippage }),
      }),
      {
        name: 'tower.swap',
        version: 1,
        partialize: (state) => ({ slippage: state.slippage } as unknown as State),
        migrate: (persistedState: any, _version) => {
          if (!persistedState || typeof persistedState !== 'object') {
            return { slippage: 'auto' } as unknown as State;
          }
          const raw = (persistedState as any).slippage;
          const slippage = typeof raw === 'string' ? raw : raw?.toString?.() ?? 'auto';
          return { slippage } as unknown as State;
        },
      }
    )
  )
);
