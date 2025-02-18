import { Addr, Asset, AssetInfo, AssetType, CoinResponse, NativeToken, PairInfo } from '~/interfaces';
import CosmosService from '~/services/cosmos.service';

export default class AssetService {
  cosmosService: CosmosService;

  constructor() {
    this.cosmosService = new CosmosService();
  }

  async getNativeTokens(chainId: string, contractAddress: string): Promise<Asset[]> {
    try {
      let res: CoinResponse[] = await this.cosmosService.queryContract<CoinResponse[]>(chainId, contractAddress, {
        native_tokens: { limit: 1000 }
      });

      // todo: apply schema
      return res.map((item: CoinResponse) => {
        return {
          contract_addr: 'undefined',
          symbol: 'undefined',
          denom: item.denom,
          type: 'native',
          decimals: item.decimals,
          price: 'undefined',
          name: 'undefined',
          logo_URI: 'undefined'
        } as Asset;
      }) as Asset[];
    } catch (err) {
      // todo determine failure case return
      console.log(err);

      throw err;
    }
  }

  async getNativeTokenByDenom(chainId: string, contractAddress: string, denom: string): Promise<Asset> {
    try {
      // todo: apply schema
      let res: CoinResponse = await this.cosmosService.queryContract<CoinResponse>(chainId, contractAddress, {
        native_token: { denom: denom }
      });

      // todo determine all properties
      return {
        contract_addr: 'undefined',
        symbol: 'undefined',
        denom: res.denom,
        type: 'native',
        decimals: res.decimals,
        price: 'undefined',
        name: 'undefined',
        logo_URI: 'undefined'
      } as Asset;
    } catch (err) {
      // todo determine failure case return
      console.log(err);

      throw err;
    }
  }

  async getAssetByAssetInfo(chainId: string, contractAddress: string, assetInfo: AssetInfo): Promise<Asset> {
    // Babylon only supports native tokens
    assetInfo = assetInfo as NativeToken;
    return await this.getNativeTokenByDenom(chainId, contractAddress, assetInfo.native_token.denom);
  }
}