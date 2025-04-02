declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PW: string;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
    }
  }
  interface Env {
    CONTRACTS: string;
  }
  interface Window {
    env: Env;
  }
}

export {};
