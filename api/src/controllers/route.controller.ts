import { NextFunction, Request, Response, Router } from 'express';
import RouteService from '~/services/route.service';
import { Controller } from '~/interfaces/controller';

const controller = Router();
const routeService = new RouteService();

controller.get('/route', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token_in = '', token_out = '', amount_in = '' } = req.query;
    const route = await routeService.getRoute(token_in as string, token_out as string, amount_in as string);
    res.status(200).send(
      {
        status: 'success',
        message: '',
        data: route
      }
    );
  } catch (err) {
    next(err);
  }
});

export default { prefixPath: '/', middlewares: [], controller } as Controller;