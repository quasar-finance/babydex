import { Router } from 'express';

export interface Controller {
  prefixPath: string;
  middlewares: never[];
  controller: Router;
}
