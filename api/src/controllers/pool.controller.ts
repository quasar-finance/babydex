import { NextFunction, Request, Response, Router } from 'express';
import PoolService from '~/services/pool.service';
import { Controller } from '~/interfaces/controller';
import AssetService from '~/services/asset.service';
import CGeckoService from '~/services/cgecko.service';
import RedisService from '~/services/redis.service';
import { ContractQueryServiceFactory } from '~/services/contract.query.service';

const controller = Router();
const contractQueryService = ContractQueryServiceFactory.getInstance();
const cgeckoService = new CGeckoService();
const redisService = new RedisService();
const assetService = new AssetService(contractQueryService, cgeckoService, redisService);
const poolService = new PoolService(contractQueryService, assetService);

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