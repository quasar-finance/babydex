// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    // host: "aws-0-eu-central-1.pooler.supabase.com",
    // port: 5432,
    // user: "v1_cosmos_readonly.lvyyjzphlxqtdlponywj",
    // password: "HYJx}5/2{MSqNd,g",
    // database: "postgres",
    url: "postgresql://v1_cosmos_readonly.lvyyjzphlxqtdlponywj:HYJx%7D5%2F2%7BMSqNd%2Cg@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
    // HYJx%7D5%2F2%7BMSqNd%2Cg
  },
  schemaFilter: "v1_cosmos",
});