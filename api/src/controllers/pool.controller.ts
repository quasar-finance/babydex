import { NextFunction, Request, Response, Router } from 'express';
import PoolService from '~/services/pool.service';
import { Controller } from '~/interfaces/controller';

const controller = Router();
const poolService = new PoolService();

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