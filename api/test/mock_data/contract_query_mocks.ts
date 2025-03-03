import {
  PairInfo,
  CoinResponse,
  ContractPoolResponse,
  ContractConcentratedPoolParams,
  ContractXYKPoolParams, ContractConfigResponse
} from '~/interfaces';

export const coin_response: CoinResponse[] = [
  {
    decimals: 6,
    denom: 'ubbn'
  },
  {
    decimals: 8,
    denom: 'usdc'
  },
  {
    decimals: 8,
    denom: 'cbbtc'
  }, {
    decimals: 8,
    denom: 'weth'
  }
];
export const pair_info: PairInfo[] = [
  {
    asset_infos: [
      {
        native_token: {
          denom: 'ubbn'
        }
      },
      {
        native_token: {
          denom: 'usdc'
        }
      }
    ],
    contract_addr: 'xyk_contract_address',
    liquidity_token: 'some_liquidity_token_1',
    pair_type: {
      xyk: {}
    }
  },
  {
    asset_infos: [
      {
        native_token: {
          denom: 'cbbtc'
        }
      },
      {
        native_token: {
          denom: 'weth'
        }
      }
    ],
    contract_addr: 'concentrated_contract_address',
    liquidity_token: 'some_liquidity_token_2',
    pair_type: {
      concentrated: {}
    }
  }
];

export const pool_response_xyk: ContractPoolResponse = {
  assets: [
    {
      info: {
        native_token: {
          denom: 'ubbn'
        }
      },
      amount: 1000
    },
    {
      info: {
        native_token: {
          denom: 'usdc'
        }
      },
      amount: 1000
    }
  ], total_share: 2000
};

export const pool_response_concentrated: ContractPoolResponse = {
  assets: [
    {
      info: {
        native_token: {
          denom: 'cbbtc'
        }
      },
      amount: 1000
    },
    {
      info: {
        native_token: {
          denom: 'weth'
        }
      },
      amount: 1000
    }
  ], total_share: 2000
};

export const pool_config_params_xyk: ContractXYKPoolParams = {
  fee_share: {
    bps: 4321,
    recipient: 'some_xyk_recipient'
  }
};

export const pool_config_params_concentrated: ContractConcentratedPoolParams = {
  amp: 0,
  fee_gamma: 0,
  fee_share: {
    bps: 100,
    recipient: 'some_concentrated_recipient'
  },
  gamma: 0,
  ma_half_time: 0,
  mid_fee: 1234,
  min_price_scale_delta: 0,
  out_fee: 0,
  price_scale: 0,
  repeg_profit_threshold: 0
};

export const pool_config_xyk: ContractConfigResponse = {
  block_time_last: 0,
  factory_addr: 'some_factory',
  owner: 'some_owner',
  params: Buffer.from(JSON.stringify(pool_config_params_xyk)).toString('base64')
};

export const pool_config_concentrated: ContractConfigResponse = {
  block_time_last: 0,
  factory_addr: 'some_factory',
  owner: 'some_owner',
  params: Buffer.from(JSON.stringify(pool_config_params_concentrated)).toString('base64')
};