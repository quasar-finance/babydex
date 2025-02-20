import { Addr, Asset, AssetInfo, PairInfo, PairType, Pool } from '../../src/interfaces';

export const asset_list: Asset[] = [
  {
    contract_addr: 'some_contract_address',
    symbol: 'BABY',
    denom: 'some_denom_address1',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  },
  {
    contract_addr: 'some_contract_address',
    symbol: 'USDC',
    denom: 'some_denom_address2',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  },
  {
    contract_addr: 'some_contract_address',
    symbol: 'WBTC',
    denom: 'some_denom_address3',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  }, {
    contract_addr: 'some_contract_address',
    symbol: 'WETH',
    denom: 'some_denom_address4',
    type: 'native',
    decimals: 8,
    price: '1',
    name: 'some_name',
    logo_URI: 'some_logo_URI'
  }
];

export const pools: Pool[] = [
  {
    contract_addr: 'some_contract_address',
    token0: {
      contract_addr: 'some_contract_address',
      symbol: 'BABY',
      name: 'some_name',
      reserve: '1000'
    },
    token1: {
      contract_addr: 'some_contract_address',
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
          denom: 'some_denom_address1'
        }
      },
      {
        native_token: {
          denom: 'some_denom_address2'
        }
      }
    ],
    contract_addr: 'some_contract_address1',
    liquidity_token: 'some_liquidity_token1',
    pair_type: {
      xyk: {}
    }
  },
  {
    asset_infos: [
      {
        native_token: {
          denom: 'some_denom_address3'
        }
      },
      {
        native_token: {
          denom: 'some_denom_address4'
        }
      }
    ],
    contract_addr: 'some_contract_address2',
    liquidity_token: 'some_liquidity_token2',
    pair_type: {
      xyk: {}
    }
  }
];