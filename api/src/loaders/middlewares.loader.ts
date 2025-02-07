import * as globalMiddlewares from '../middlewares';
import { Application } from 'express';

export const middlewares = async (app: Application): Promise<void> => {
    Object.values(globalMiddlewares).forEach((middleware) => app.use(middleware));
};