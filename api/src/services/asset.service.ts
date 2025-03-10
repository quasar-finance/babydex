import { AssetResponse, CoinResponse } from "~/interfaces";
import { ContractQueryService } from "~/services/contract.query.service";
import RedisService from "~/services/redis.service";
import { PricingQueryService } from "~/services/pricing.query.service";
import { getBaseAssetByDenom } from "~/utils/getMockAssets";
import { Asset } from "../../@chain-registry/assetlist";
import { ASSET_RESPONSE_CACHE_KEY, CONTRACT_ADDRESSES } from "~/utils/constant";

export default class AssetService {

  constructor(
    private contractQueryService: ContractQueryService,
    private pricingQueryService: PricingQueryService,
    private redisService: RedisService) {
  }

  async getNativeTokens(chainId: string, refresh?: Boolean): Promise<AssetResponse[]> {
    try {
      let res: AssetResponse[] | null;

      if (!refresh) {
        res = await this.redisService.get<AssetResponse[] | null>(`${ASSET_RESPONSE_CACHE_KEY}_${chainId}`);

        if (res !== null && res.length > 0) {
          return res;
        }
      }

      const restUrl = this.contractQueryService.getRestUrlByChainId(chainId);
      const contractAddress = this.contractQueryService.getContractAddressByChainId("coin_registry", chainId);

      const coinResponse: CoinResponse[] = await this.contractQueryService
        .queryContract<CoinResponse[]>(restUrl, contractAddress, {
          native_tokens: { limit: 100000 },
        });

      if (coinResponse.length === 0) {
        throw Error(`Coin response could not be found for chainId: ${chainId}, contractAddress: ${contractAddress}`);
      }

      res = await Promise.all(
        coinResponse.map((item: CoinResponse) => {
          return this.getAssetFromChainRegistry(item.denom, item.decimals);
        }),
      );

      await this.redisService.set(`${ASSET_RESPONSE_CACHE_KEY}_${chainId}`, res, { EX: 300 });

      return res;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  // TODO: replace when chain registry is live
  async getAssetFromChainRegistry(denom: string, decimals: number): Promise<AssetResponse> {
    let contractAddr = denom;
    let symbol = "";
    let type = "native";
    let price = { usd: 0, eur: 0 };
    let name = "";
    let logo_URI = "";

    const asset: Asset | null = getBaseAssetByDenom(denom);

    if (asset) {
      contractAddr = asset.address || contractAddr;
      symbol = asset.symbol;
      type = asset.type_asset || type;
      price = await this.pricingQueryService.getCoinPrice(asset.coingecko_id);
      name = asset.name || name;
      logo_URI = this.determineAssetLogoURI(asset);
    }

    return {
      contract_addr: contractAddr,
      symbol: symbol,
      denom: denom,
      type: type,
      decimals: decimals,
      price: `${price.usd}`,
      name: name,
      logo_URI: logo_URI,
    } as AssetResponse;
  }

  private determineAssetLogoURI(asset: Asset) {
    return asset.logo_URIs?.svg || asset.logo_URIs?.png || "";
  }
}