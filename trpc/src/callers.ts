import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { EdgeRouter } from "./router.js";

export const edgeCaller = createTRPCProxyClient<EdgeRouter>({
  links: [
    httpLink({
      url: process.env.NEXT_PUBLIC_API_URL ?? "",
      fetch: async (input, init?) => {
        return fetch(input, init);
      },
    }),
  ],
});
