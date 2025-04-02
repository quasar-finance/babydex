import { createTRPCPublicProcedure, createTRPCRouter } from "../config.js";

export const userRouter = createTRPCRouter({
  getPositions: createTRPCPublicProcedure.query(async () => {
    return [
      {
        id: "1",
        poolId: "1",
        staked: "100000000000000000000",
      },
    ];
  }),
});
