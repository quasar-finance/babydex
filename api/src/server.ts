import 'dotenv/config';
import '~/loaders/logger.loader';

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import nocache from 'nocache';
import httpLogger from 'pino-http';
import * as loaders from './loaders';
import { errorHandler } from './middlewares';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './config/swagger';
import * as trpcExpress from '@trpc/server/adapters/express';
import {trpcRouter } from './trpc/trpc';

const { SERVER_PORT } = process.env;
const globalAny:any = global;
const server = express();

server.use(cors());
// server.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));
server.use(helmet());
server.use(nocache());
server.use(compression());
server.use(express.json());
server.use(httpLogger({ logger: globalAny.logger, useLevel: 'debug' }));
server.use(express.urlencoded({ extended: false }));
server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
server.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter
  }),
);

server.listen(SERVER_PORT, async () => {
  await loaders.redis.connect();
  await loaders.middlewares(server);
  await loaders.controllers(server);
  server.use(errorHandler);
  logger.info(`Server running and listening in port: ${SERVER_PORT}`);
});

process.on('SIGINT', loaders.redis.disconnect);
process.on('SIGTERM', loaders.redis.disconnect);
