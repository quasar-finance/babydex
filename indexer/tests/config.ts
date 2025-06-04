import path = require("path");
import dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env.testing") });

interface ENV {
  NODE_ENV: string | undefined;
  SUPABASE_URL: string | undefined;
  SUPABASE_KEY: string | undefined;
  SUPABASE_HOST: string | undefined;
  SUPABASE_PORT: number | undefined;
  SUPABASE_USER: string | undefined;
  SUPABASE_PW: string | undefined;
  SUPABASE_DB: string | undefined;
  SUPABASE_SSL: boolean | undefined;
}

interface Config {
  NODE_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  SUPABASE_HOST: string;
  SUPABASE_PORT: number;
  SUPABASE_USER: string;
  SUPABASE_PW: string;
  SUPABASE_DB: string;
  SUPABASE_SSL: boolean;
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_HOST: process.env.SUPABASE_HOST,
    SUPABASE_PORT: process.env.SUPABASE_PORT ? Number(process.env.SUPABASE_PORT) : undefined,
    SUPABASE_USER: process.env.SUPABASE_USER,
    SUPABASE_PW: process.env.SUPABASE_PW,
    SUPABASE_DB: process.env.SUPABASE_DB,
    SUPABASE_SSL: process.env.SUPABASE_SSL
      ? process.env.SUPABASE_SSL.toLowerCase() === "true"
      : false,
  };
};

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const sanitizedConfig = getSanitizedConfig(getConfig());

export default sanitizedConfig;
