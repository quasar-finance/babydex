import {createTRPCPublicProcedure, createTRPCRouter} from "../config.js";
import {z} from "zod";

export const referralRouter = createTRPCRouter({
  fetchReferralCode: createTRPCPublicProcedure
    .input(z.object({userWalletAddress: z.string().min(1, "Invalid wallet address")}))
    .query(async ({ctx, input}) => {
      return await ctx.referralService.fetchReferralCode(input.userWalletAddress);
    }),
  storeReferralCode: createTRPCPublicProcedure
    .input(z.object({userWalletAddress: z.string().min(1, "Invalid wallet address")}))
    .query(async ({ctx, input}) => {
      return await ctx.referralService.storeReferralCode(input.userWalletAddress);
    }),
  handleReferral: createTRPCPublicProcedure
    .input(z.object({
      referredUserWalletAddress: z.string().min(1, "Invalid wallet address"),
      referralCode: z.string().length(8, "Invalid referral code")
    }))
    .query(async ({ctx, input}) => {
      return await ctx.referralService.handleReferral(input.referredUserWalletAddress, input.referralCode);
    }),
});