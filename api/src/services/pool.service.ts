import {
  ContractPoolResponse,
  PairInfo,
  PoolAsset,
  AssetResponse,
  NativeToken,
  PoolResponse,
  ContractAsset, PairType, ContractConfigResponse, ContractConcentratedPoolParams, ContractXYKPoolParams
} from '~/interfaces';
import { ContractQueryService } from '~/services/contract.query.service';
import AssetService from '~/services/asset.service';
import RedisService from '~/services/redis.service';
import { POOL_RESPONSE_CACHE_KEY } from '~/utils/constant';

export default class PoolService {
  constructor(
    private contractQueryService: ContractQueryService,
    private assetService: AssetService,
    private redisService: RedisService) {
  }

  // A pool represents a token pair which can be accessed in astrofork factory contract:
  // The message format is QueryMsg::Pairs { start_after: optional, limit: optional }
  async getPools(chainId: string, contractAddress: string): Promise<PoolResponse[]> {
    try {
      let res: PoolResponse[] | null = await this.redisService.get<PoolResponse[] | null>(`${POOL_RESPONSE_CACHE_KEY}_${chainId}`);

      if (res !== null && res.length > 0) {
        return res;
      }

      const pair_info: PairInfo[] = await this.contractQueryService
        .queryContract<PairInfo[]>(chainId, contractAddress, {
          pairs: { limit: 100000 }
        });

      if (pair_info.length === 0) {
        throw Error(`Pair info could not be found for chainId: ${chainId}, contractAddress: ${contractAddress}`);
      }

      // If we have not cached the pool response yet, ensure to
      // get an uncached list of assets so we have all the latest tokens
      const assets = await this.assetService.getNativeTokens(chainId, contractAddress, true);

      res = await Promise.all(
        pair_info.map(async (item: PairInfo): Promise<PoolResponse> => {
          const token0_denom = (item.asset_infos[0] as NativeToken).native_token.denom;
          const token1_denom = (item.asset_infos[1] as NativeToken).native_token.denom;

          const token0: AssetResponse | undefined = assets.find((asset: AssetResponse) => asset.denom === token0_denom);
          const token1: AssetResponse | undefined = assets.find((asset: AssetResponse) => asset.denom === token1_denom);

          if (!token0) {
            throw Error(`Token0 with denom not found: ${token0_denom}`);
          }

          if (!token1) {
            throw Error(`Token1 with denom not found: ${token1_denom}`);
          }

          const contractPoolResponse = await this.contractQueryService
            .queryContract<ContractPoolResponse>(chainId, item.contract_addr, {
              pool: {}
            });

          const token0_contractAsset = contractPoolResponse.assets.find((asset: ContractAsset) =>
            (asset.info as NativeToken).native_token.denom === token0_denom);
          const token0_reserve = token0_contractAsset ? token0_contractAsset.amount : 0;

          const token1_contractAsset = contractPoolResponse.assets.find((asset: ContractAsset) =>
            (asset.info as NativeToken).native_token.denom === token1_denom);
          const token1_reserve = token1_contractAsset ? token1_contractAsset.amount : 0;

          const fee_tier = await this.determineFeeTier(chainId, item.contract_addr, item.pair_type);

          return {
            contract_addr: item.contract_addr,
            token0: {
              contract_addr: token0.contract_addr,
              symbol: token0.symbol,
              name: token0.name,
              reserve: token0_reserve
            } as PoolAsset,
            token1: {
              contract_addr: token1.contract_addr,
              symbol: token1.symbol,
              name: token1.name,
              reserve: token1_reserve
            } as PoolAsset,
            fee_tier: fee_tier,
            liquidity_token: item.liquidity_token
          } as PoolResponse;
        })
      );

      await this.redisService.set(`${POOL_RESPONSE_CACHE_KEY}_${chainId}`, res, { EX: 300 });

      return res;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  private async determineFeeTier(chainId: string, contractAddr: string, pairType: PairType): Promise<number> {
    const contractPoolResponse = await this.contractQueryService
      .queryContract<ContractConfigResponse>(chainId, contractAddr, {
        config: {}
      });

    if (!contractPoolResponse.params) {
      return 0;
    }

    const jsonParams = atob(contractPoolResponse.params);

    if (pairType.hasOwnProperty('xyk')) {
      const params = JSON.parse(jsonParams) as ContractXYKPoolParams;

      if (!params.fee_share) {
        return 0;
      }

      return params.fee_share.bps;
    }

    if (pairType.hasOwnProperty('concentrated')) {
      const params = JSON.parse(jsonParams) as ContractConcentratedPoolParams;

      return params.mid_fee;
    }

    throw Error('PairType neither \'xyk\' nor \'concentrated\'');
  }
}