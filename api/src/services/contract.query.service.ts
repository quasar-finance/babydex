import CosmosService from "~/services/cosmos.service";
import {
  coin_response,
  pair_info,
  pool_config_concentrated,
  pool_config_xyk, pool_response_concentrated,
  pool_response_xyk,
} from "../../test/mock_data";

const { NODE_ENV } = process.env;

export interface ContractQueryService {
  queryContract<T = any>(restUrl: string, contractAddress: string, queryMsg: Record<string, unknown>): Promise<T>;

  getRestUrlByChainId(chainId: string): string;

  getContractAddressByChainId(addressKey: string, chainId?: string): string;
}

export class MockContractQueryService implements ContractQueryService {
  async queryContract<T = any>(_restUrl: string, _contractAddress: string, queryMsg: Record<string, unknown>): Promise<T> {
    if (queryMsg.hasOwnProperty("native_tokens")) {
      return coin_response as T;
    }

    if (queryMsg.hasOwnProperty("pairs")) {
      return pair_info as T;
    }

    if (queryMsg.hasOwnProperty("pool")) {
      if (_contractAddress == "xyk_contract_address") {
        return pool_response_xyk as T;
      }

      if (_contractAddress == "concentrated_contract_address") {
        return pool_response_concentrated as T;
      }

      throw new Error("Unknown pool contract address");
    }

    if (queryMsg.hasOwnProperty("config")) {
      if (_contractAddress == "xyk_contract_address") {
        return pool_config_xyk as T;
      }

      if (_contractAddress == "concentrated_contract_address") {
        return pool_config_concentrated as T;
      }

      throw new Error("Unknown pool config contract address");
    }

    throw new Error("Not implemented");
  }

  getRestUrlByChainId(chainId: string): string {
    return "";
  }

  getContractAddressByChainId(addressKey: string, chainId?: string): string {
    return "";
  }
}

export class ContractQueryServiceFactory {
  private static instance: ContractQueryService;

  static getInstance(): ContractQueryService {
    if (!this.instance) {
      switch (NODE_ENV) {
        case "development":
        case "testing":
          this.instance = new MockContractQueryService();
          break;
        default:
          this.instance = new CosmosService();
      }

    }

    return this.instance;
  }
}
