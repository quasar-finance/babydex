import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["@tanstack/react-query"] = path.resolve(
      __dirname,
      "node_modules/@tanstack/react-query",
    );
    return config;
  },
  images: {
    domains: ["raw.githubusercontent.com", "localhost", "github.com"],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/swap",
      permanent: true,
    },
  ],
};

export default nextConfig;
