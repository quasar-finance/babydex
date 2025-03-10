// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as process from "node:process";

export default defineConfig({
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.SUPABASE_HOST,
    port: Number(process.env.SUPABASE_PORT),
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PW,
    database: process.env.SUPABASE_DB,
    ssl: false,
  },
  schemaFilter: "v1_cosmos",
});