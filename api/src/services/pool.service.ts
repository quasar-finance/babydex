import { Pool, PairInfo, PoolAsset, StrategyAsset } from '~/interfaces';
import { ContractQueryService } from '~/services/contract.query.service';
import AssetService from '~/services/asset.service';
import RedisService from '~/services/redis.service';

export default class PoolService {
  constructor(
    private contractQueryService: ContractQueryService,
    private assetService: AssetService,
    private redisService: RedisService) {
  }

  // A pool represents a token pair which can be accessed in astrofork factory contract:
  // The message format is QueryMsg::Pairs { start_after: optional, limit: optional }
  async getPools(chainId: string, contractAddress: string): Promise<Pool[]> {
    try {
      let res: PairInfo[] | null = await this.redisService.get<PairInfo[] | null>(`pair_info[]_${chainId}`);

      if (!res) {
        res = await this.contractQueryService.queryContract<PairInfo[]>(chainId, contractAddress, {
          pairs: { limit: 1000 }
        });

        if (!res) {
          throw Error(`Pair info could not be found for chainId: ${chainId}, contractAddress: ${contractAddress}`);
        }

        await this.redisService.set(`pair_info[]_${chainId}`, res);
      }

      return await Promise.all(
        res.map(async (item: PairInfo): Promise<Pool> => {
          let token0: StrategyAsset = await this.assetService.getAssetByAssetInfo(item.asset_infos[0]);
          let token1: StrategyAsset = await this.assetService.getAssetByAssetInfo(item.asset_infos[1]);

          // todo determine all properties
          return {
            contract_addr: item.contract_addr,
            token0: {
              contract_addr: token0.contract_addr,
              symbol: token0.symbol,
              name: token0.name,
              reserve: 'undefined'
            } as PoolAsset,
            token1: {
              contract_addr: token1.contract_addr,
              symbol: token1.symbol,
              name: token1.name,
              reserve: 'undefined'
            } as PoolAsset,
            fee_tier: 0
          } as Pool;
        })
      );
    } catch (err) {
      console.log(err);

      throw err;
    }
  }
}