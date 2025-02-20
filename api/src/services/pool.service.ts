import { Pool, PairInfo, PoolAsset, Asset, CoinResponse } from '~/interfaces';
import CosmosService from '~/services/cosmos.service';
import AssetService from '~/services/asset.service';
import { pair_info } from '../../test/mock_data';

export default class PoolService {
  cosmosService: CosmosService;
  assetService: AssetService;

  constructor() {
    this.cosmosService = new CosmosService();
    this.assetService = new AssetService();
  }

  // A pool represents a token pair which can be accessed in astrofork factory contract:
  // The message format is QueryMsg::Pairs { start_after: optional, limit: optional }
  async getPools(chainId: string, contractAddress: string): Promise<Pool[]> {
    try {
      // todo remove after we use IoC or real data
      let res: PairInfo[] = pair_info;

      // let res: PairInfo[] = await this.cosmosService.queryContract<PairInfo[]>(chainId, contractAddress, {
      //   pairs: { limit: 1000 }
      // });


      return await Promise.all(
        res.map(async (item: PairInfo): Promise<Pool> => {
          let token0: Asset = await this.assetService.getAssetByAssetInfo(chainId, contractAddress, item.asset_infos[0]);
          let token1: Asset = await this.assetService.getAssetByAssetInfo(chainId, contractAddress, item.asset_infos[1]);

          // todo determine all properties
          return {
            contract_addr: 'undefined',
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