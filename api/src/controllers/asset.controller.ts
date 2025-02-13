import { NextFunction, Request, Response, Router } from 'express';
import AssetService from '~/services/pool.service';
import { serialize } from 'superjson';

const controller = Router();
const assetService = new AssetService();

controller.get('/assets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assets = await assetService.getAssets();
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