import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import { SQL, asc, desc } from "drizzle-orm";
import { StringChunk } from "drizzle-orm/sql/sql";
import { addLiquidityInV1Cosmos } from "../../drizzle/schema";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.SUPABASE_HOST, // "aws-0-eu-central-1.pooler.supabase.com",
  port: Number(process.env.SUPABASE_PORT), // "5432"
  user: process.env.SUPABASE_USER, // "v1_cosmos_readonly.lvyyjzphlxqtdlponywj",
  password: process.env.SUPABASE_PW, // "HYJx}5/2{MSqNd,g",
  database: process.env.SUPABASE_DB, //"postgres",
  ssl: false, // process.env.NODE_ENV === "production",
});

// const connectionString: string = "postgresql://v1_cosmos_readonly.lvyyjzphlxqtdlponywj:HYJx%7D5%2F2%7BMSqNd%2Cg@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"; //process.env.DATABASE_URL ?? "";

export const drizzleService = drizzle(pool);

export function buildQuery() {}

export function withPagination<T extends PgSelect>(
  qb: T,
  page = 1,
  pageSize = 50,
  orderBy: "asc" | "desc",
  orderByColumn?: string | null | undefined,
) {
  qb
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  if (orderByColumn) {
    const orderByColumnSQL = new StringChunk(orderByColumn);
    qb.orderBy(orderBy == "asc" ? asc(orderByColumnSQL) : desc(orderByColumnSQL));
  }

  return qb;
}

async function queryWithCount<T extends PgSelect>(qb: T): Promise<[Awaited<T>, number]> {
  const result = await qb;
  // @ts-ignore hack to override internals (not the ideal way)
  qb.config.fields = { count: count() };
  // @ts-ignore
  qb.config.orderBy = [];
  const [total] = await qb;
  return [result, total.count];
}

