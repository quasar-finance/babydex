import { NextFunction, Request, Response, Router } from 'express';
import PoolService from '~/services/pool.service';
import { Controller } from '~/interfaces/controller';
import AssetService from '~/services/asset.service';
import RedisService from '~/services/redis.service';
import { ContractQueryServiceFactory } from '~/services/contract.query.service';
import { PricingQueryServiceFactory } from '~/services/pricing.query.service';

const controller = Router();
const contractQueryService = ContractQueryServiceFactory.getInstance();
const pricingQueryService = PricingQueryServiceFactory.getInstance();
const redisService = new RedisService();
const assetService = new AssetService(contractQueryService, pricingQueryService, redisService);
const poolService = new PoolService(contractQueryService, assetService, redisService);

controller.get('/pools', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chainId, contractAddress } = req.query;
    const pools = await poolService.getPools(chainId as string, contractAddress as string);
    res.status(200).send(
      {
        status: 'success',
        data: pools
      }
    );
  } catch (err) {
    next(err);
  }
});

export default { prefixPath: '/', middlewares: [], controller } as Controller;