import CosmosService from '~/services/cosmos.service';
import { pair_info } from '../../test/mock_data';
import { coin_response } from '../../test/mock_data/coin_response_mock';

const { NODE_ENV } = process.env;

export interface ContractQueryService {
  queryContract<T = any>(chainId: string, contractAddress: string, queryMsg: Record<string, unknown>): Promise<T>;
}

export class MockContractQueryService implements ContractQueryService {
  async queryContract<T = any>(_chainId: string, _contractAddress: string, queryMsg: Record<string, unknown>): Promise<T> {
    if (queryMsg.hasOwnProperty('native_tokens')) {
      return coin_response as T;
    }

    if (queryMsg.hasOwnProperty('native_token')) {
      // @ts-ignore
      let res = coin_response.find((item) => item.denom === queryMsg.native_token.denom);

      if (!res) {
        throw new Error('Could not find a native token');
      }

      return res as T;
    }

    console.log(queryMsg);
    if (queryMsg.hasOwnProperty('pairs')) {
      return pair_info as T;
    }

    throw new Error('Not implemented');
  }
}


export class ContractQueryServiceFactory {
  private static instance: ContractQueryService;

  static getInstance(): ContractQueryService {
    if (!this.instance) {
      switch (NODE_ENV) {
        case 'development':
        case 'testing':
          this.instance = new MockContractQueryService();
          break;
        default:
          this.instance = new CosmosService();
      }

    }

    return this.instance;
  }
}
