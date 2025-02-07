import { Application } from 'express';
import * as globalControllers from '~/controllers';

export const controllers = async (app: Application): Promise<void> => {
  Object.values(globalControllers).forEach((file) => app.use(file.prefixPath, ...file.middlewares, file.controller));
};
