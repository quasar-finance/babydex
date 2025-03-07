import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from '~/interfaces/controller';
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { addLiquidityInV1Cosmos } from "../../schema/drizzle/schema";

const controller = Router();

const connectionString: string = "postgresql://v1_cosmos_readonly.lvyyjzphlxqtdlponywj:HYJx%7D5%2F2%7BMSqNd%2Cg@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"; //process.env.DATABASE_URL ?? "";

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);

controller.get('/indexer', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { table } = req.query;

    const data = await db.select().from(addLiquidityInV1Cosmos);

    res.status(200).send(
      {
        data: data
      }
    );
  } catch (err) {
    next(err);
  }
});

export default { prefixPath: '/', middlewares: [], controller } as Controller;