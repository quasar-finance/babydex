import { StrategyAsset, AssetInfo, CoinResponse, NativeToken } from '~/interfaces';
import { ContractQueryService } from '~/services/contract.query.service';
import RedisService from '~/services/redis.service';
import { PricingQueryService } from '~/services/pricing.query.service';
import { getBaseAsset, getBaseAssetByDenom } from '~/utils/getMockAssets';
import { Asset } from '../../@chain-registry/assetlist';

export default class AssetService {

  constructor(
    private contractQueryService: ContractQueryService,
    private pricingQueryService: PricingQueryService,
    private redisService: RedisService) {
  }

  async getNativeTokens(chainId: string, contractAddress: string): Promise<StrategyAsset[]> {
    try {
      let res: CoinResponse[] | null = await this.redisService.get<CoinResponse[] | null>(`coin_response[]_${chainId}`);

      if (!res) {
        res = await this.contractQueryService.queryContract<CoinResponse[]>(chainId, contractAddress, {
          native_tokens: { limit: 1000 }
        });

        if (!res) {
          throw Error(`Coin response could not be found for chainId: ${chainId}, contractAddress: ${contractAddress}`);
        }

        await this.redisService.set(`coin_response[]_${chainId}`, res);

        for (const coin of res) {
          await this.redisService.set(`coin_response_${chainId}_${coin.denom}`, res);
        }
      }

      return await Promise.all(res.map((item: CoinResponse) =>
        this.getAssetFromChainRegistry(item.denom)
      ));
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async getNativeTokenByDenom(chainId: string, contractAddress: string, denom: string): Promise<StrategyAsset> {
    try {
      let res: CoinResponse | null = await this.redisService.get<CoinResponse | null>(`coin_response_${chainId}_${denom}`);

      if (!res) {
        res = await this.contractQueryService.queryContract<CoinResponse | null>(chainId, contractAddress, {
          native_token: { denom: denom }
        });

        if (!res) {
          throw Error(`Coin response could not be found: ${denom}`);
        }

        await this.redisService.set(`coin_response_${chainId}_${denom}`, res);
      }

      return this.getAssetFromChainRegistry(denom);
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async getAssetByAssetInfo(chainId: string, contractAddress: string, assetInfo: AssetInfo): Promise<StrategyAsset> {
    // Babylon only supports native tokens
    assetInfo = assetInfo as NativeToken;
    return await this.getNativeTokenByDenom(chainId, contractAddress, assetInfo.native_token.denom);
  }

  // TODO: replace when chain registry is live
  async getAssetFromChainRegistry(denom: string): Promise<StrategyAsset> {

    const asset: Asset | undefined = getBaseAssetByDenom(denom);

    if (!asset) {
      throw new Error(`Asset with denom ${denom} could not be found`);
    }

    const price =  await this.pricingQueryService.getCoinPrice(asset.coingecko_id);
    const decimals: number = asset.denom_units.reduce(
      (acc, { exponent }) => (acc > exponent ? acc : exponent), 0);
    const logo_URI = asset.logo_URIs?.svg || asset.logo_URIs?.png || '';

    return {
      contract_addr: asset.address,
      symbol: asset.symbol,
      denom: asset.base,
      type: 'native',
      decimals: decimals,
      price: `${price.usd}`,
      name: asset.name,
      logo_URI: logo_URI
    } as StrategyAsset;
  }
}