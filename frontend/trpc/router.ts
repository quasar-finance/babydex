import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { TRPCClientError, type TRPCLink } from "@trpc/client";

import type { AnyRouter } from "@trpc/server";
import type { ContextOptions } from "@towerfi/trpc";

export const createInnerTRPCContext = (opts: ContextOptions) => {
  return opts;
};

const t = initTRPC.context<typeof createInnerTRPCContext>().create({
  allowOutsideOfServer: true,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCPublicProcedure = t.procedure;

export function createLocalTRPCLink<TRouter extends AnyRouter>(
  opts: { router: TRouter } & Omit<ContextOptions, "indexerService">,
): TRPCLink<TRouter> {
  const { router, ...ctx } = opts;
  const createCaller = createCallerFactory(router);
  return () =>
    ({ op }) => {
      return observable((observer) => {
        (async () => {
          const { path, input } = op;
          const caller = createCaller(ctx);

          try {
            const data = await (caller[path] as (input: unknown) => unknown)(input);
            observer.next({ result: { data } });
            observer.complete();
          } catch (error) {
            console.log(error, "error");
            observer.error(TRPCClientError.from(error as Error));
          }
        })();
      });
    };
}
