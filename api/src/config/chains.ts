import { base, arbitrum } from 'viem/chains';

export const chainsConfig = {
  base: {
    info: base,
    rpc: `https://base-mainnet.infura.io/v3/${process.env.INFURA_KEY}`
  },
  arbitrum: {
    info: arbitrum,
    rpc: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_KEY}`
  }
};
