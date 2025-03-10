import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

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