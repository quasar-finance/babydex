import { Request, Response, Router } from 'express';
import { Controller } from '~/interfaces/controller';
import { readFileSync } from 'fs';
import { supabase } from '~/loaders/supabase.loader';

const controller = Router();
const pjson = JSON.parse(readFileSync('./package.json', 'utf-8'));

controller.get('/health', (req: Request, res: Response) => {
  res.status(200).send({
    name: pjson.name,
    version: pjson.version
  });
});

export default { prefixPath: '/', middlewares: [], controller } as Controller;
