import { NextFunction, Request, Response, Router } from 'express';
import PoolService from '~/services/pool.service';
import { serialize } from 'superjson';

const controller = Router();
const poolService = new PoolService();

controller.get('/assets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pools = await poolService.getPools();
    res.status(200).send(
      {
        status: 'success',
        data: serialize(pools)
      }
    );
  } catch (err) {
    next(err);
  }
});