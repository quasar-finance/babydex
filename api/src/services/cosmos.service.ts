import { CosmWasmClient } from "cosmwasm";
import { ContractQueryService } from "~/services/contract.query.service";
import { CONTRACT_ADDRESSES, RPC_ENDPOINTS } from "~/utils/constant";

export default class CosmosService implements ContractQueryService {
  async queryContract<T = any>(restUrl: string, contractAddress: string, queryMsg: Record<string, unknown>): Promise<T> {
    const client = await CosmWasmClient.connect(restUrl);

    return await client.queryContractSmart(contractAddress, queryMsg);
  }

  getRestUrlByChainId(chainId?: string): string {
    if (!chainId || chainId.length === 0 || !RPC_ENDPOINTS.hasOwnProperty(chainId)) {
      return RPC_ENDPOINTS["bbn-test-5"];
    }

    return RPC_ENDPOINTS[chainId as keyof typeof RPC_ENDPOINTS];
  }

  getContractAddressByChainId(addressKey: string, chainId?: string): string {
    if (!chainId || chainId.length === 0 || !RPC_ENDPOINTS.hasOwnProperty(chainId)) {
      chainId = "bbn-test-5";
    }

    const contractAddresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return contractAddresses[addressKey as keyof typeof contractAddresses];
  }
}
