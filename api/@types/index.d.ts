import P from 'pino';

declare global {
  namespace NodeJS {
    interface Global {
      logger: P.Logger;
    }
    interface ProcessEnv {
      SERVER_PORT: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      QUASAR_RPC_ENDPOINT: string;
      COINGECKO_KEY: string;
      LOG_LEVEL: string;
      REDIS_PW: string;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
    }
  }
  namespace Express {
    interface Request {}
  }
  let logger: P.Logger;
}
