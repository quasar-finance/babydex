export const environment = process.env.NEXT_PUBLIC_ENV as string;
export const isTestnet = environment === "testnet";
export const isMainnet = environment === "production";
export const isStaging = environment === "staging";
