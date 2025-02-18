import { NextFunction, Request, Response, Router } from 'express';
import AssetService from '~/services/asset.service';
import { serialize } from 'superjson';
import { Controller } from '~/interfaces/controller';

const controller = Router();
const assetService = new AssetService();

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