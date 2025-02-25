import { Asset, PairInfo, Pool } from '~/interfaces';

export const asset_list: Asset[] = [
  {
    contract_addr: 'some_contract_address_1',
    symbol: 'BABY',
    denom: 'ubbn',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  },
  {
    contract_addr: 'some_contract_address_2',
    symbol: 'USDC',
    denom: 'usdc',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  },
  {
    contract_addr: 'some_contract_address_3',
    symbol: 'WBTC',
    denom: 'wbtc',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  }, {
    contract_addr: 'some_contract_address_4',
    symbol: 'WETH',
    denom: 'weth',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  }
];

export const pools: Pool[] = [
  {
    contract_addr: 'some_contract_address_pool_1',
    token0: {
      contract_addr: 'some_contract_address_token_0',
      symbol: 'BABY',
      name: 'some_name',
      reserve: '1000'
    },
    token1: {
      contract_addr: 'some_contract_address_token_1',
      symbol: 'USDC',
      name: 'some_name',
      reserve: '1000'
    },
    fee_tier: 0
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
    contract_addr: 'some_contract_address_1',
    liquidity_token: 'some_liquidity_token_1',
    pair_type: {
      xyk: {}
    }
  },
  {
    asset_infos: [
      {
        native_token: {
          denom: 'wbtc'
        }
      },
      {
        native_token: {
          denom: 'weth'
        }
      }
    ],
    contract_addr: 'some_contract_address_2',
    liquidity_token: 'some_liquidity_token_2',
    pair_type: {
      xyk: {}
    }
  }
];