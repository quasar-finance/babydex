import { createConfig, http, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";

import type React from "react";
import type { PropsWithChildren } from "react";

const config = createConfig({
  chains: [baseSepolia],
  connectors: [],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
