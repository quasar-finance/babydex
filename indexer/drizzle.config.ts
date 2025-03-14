import {defineConfig} from "drizzle-kit";

export default defineConfig({
    out: './src/drizzle',
    schema: './src/drizzle/schema.ts',
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