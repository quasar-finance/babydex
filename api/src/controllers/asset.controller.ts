import { NextFunction, Request, Response, Router } from 'express';
import AssetService from '~/services/asset.service';
import { Controller } from '~/interfaces/controller';
import RedisService from '~/services/redis.service';
import { ContractQueryServiceFactory } from '~/services/contract.query.service';
import { PricingQueryServiceFactory } from '~/services/pricing.query.service';
import { CHAIN_IDS, CONTRACT_ADDRESSES, RPC_ENDPOINTS } from "~/utils/constant";

const controller = Router();
const contractQueryService = ContractQueryServiceFactory.getInstance();
const pricingQueryService = PricingQueryServiceFactory.getInstance();
const redisService = new RedisService();
const assetService = new AssetService(contractQueryService, pricingQueryService, redisService);

controller.get('/assets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainId } = req.query;
    const assets = await assetService.getNativeTokens(chainId as string);
    res.status(200).send(
      {
        data: assets
      }
    );
  } catch (err) {
    next(err);
  }
});

export default { prefixPath: '/', middlewares: [], controller } as Controller;