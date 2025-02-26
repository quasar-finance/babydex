import { PairInfo } from '~/interfaces';

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
          denom: 'cbbtc'
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