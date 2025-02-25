import { NextFunction, Request, Response, Router } from 'express';
import AssetService from '~/services/asset.service';
import { serialize } from 'superjson';
import { Controller } from '~/interfaces/controller';
import RedisService from '~/services/redis.service';
import { ContractQueryServiceFactory } from '~/services/contract.query.service';
import { PricingQueryServiceFactory } from '~/services/pricing.query.service';

const controller = Router();
const contractQueryService = ContractQueryServiceFactory.getInstance();
const pricingQueryService = PricingQueryServiceFactory.getInstance();
const redisService = new RedisService();
const assetService = new AssetService(contractQueryService, pricingQueryService, redisService);

controller.get('/assets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainId, contractAddress } = req.query;
    const assets = await assetService.getNativeTokens(chainId as string, contractAddress as string);
    res.status(200).send(
      {
        status: 'success',
        data: serialize(assets)
      }
    );
  } catch (err) {
    next(err);
  }
});

export default { prefixPath: '/', middlewares: [], controller } as Controller;