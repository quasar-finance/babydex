// Cache Keys
export const ASSET_RESPONSE_CACHE_KEY = 'asset_response[]';
export const POOL_RESPONSE_CACHE_KEY = 'pool_response[]';

// Contract Addresses by ChainId
// TODO add w/ correct addresses once deployed
export const CONTRACT_ADDRESSES = {
  "bbn-test-5": {
    'coin_registry': 'bbn1cersqqcxvuvzg8k5sradddufumn65xna6fcux7m6vp5n4fr6saqqw9450h',
    'factory': 'bbn1yjta8sjmff78udj2y7qztmvpdtw9ghwuv3tqu29p5aqx4mkyy06szj26h3',
    'incentives': 'bbn1y0rpf8d3ttl2rmtpn2avpkv24szsa524egjpyev97juuyggmmqzq8650z6',
    'router': 'bbn1qdc2lat5ymsy8yrm0s9ffx8cq34gjw3rg2g2fuktuq98ywqn3myscaxytn',
  }
};

// RPC Endpoints by chain ID
export const RPC_ENDPOINTS = {
  "bbn-test-5": "https://babylon-testnet-rpc.nodes.guru",
}
