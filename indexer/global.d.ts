declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
      SUPABASE_HOST: string;
      SUPABASE_PORT: string;
      SUPABASE_DB: string;
      SUPABASE_SCHEMA: string;
      SUPABASE_USER: string;
      SUPABASE_PW: string;
      SUPABASE_SSL: string;
    }
  }
}

export {};
