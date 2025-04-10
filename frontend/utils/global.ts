export const environment = process.env.NODE_ENV as string;
export const isTestnet = environment === "testnet";
export const isMainnet = environment === "mainnet";
export const isAxelar = environment === "axelar";
