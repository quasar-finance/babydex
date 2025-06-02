import { createTRPCPublicProcedure, createTRPCRouter } from "../config.js";
import { z } from "zod";

const cosmosSignedMessage = z.object({
  signature: z.string(), // Base64 encoded signature
  pubkey: z.object({
    type: z.string(), // e.g., "tendermint/PubKeySecp256k1" or "cosmos/PubKeySecp256k1"
    value: z.string(), // Base64 encoded public key
  }),
  data: z.string(), // The original data (UTF-8 string) that was signed, base64 encoded
});

export const referralRouter = createTRPCRouter({
  fetchReferralCode: createTRPCPublicProcedure
    .input(z.object({ userWalletAddress: z.string().min(1, "Invalid wallet address") }))
    .query(async ({ ctx, input }) => {
      return await ctx.referralService.fetchReferralCode(input.userWalletAddress);
    }),
  storeReferralCode: createTRPCPublicProcedure
    .input(
      z.object({
        userWalletAddress: z.string().min(1, "Invalid wallet address"),
        signedMessage: cosmosSignedMessage,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.referralService.storeReferralCode(
        input.userWalletAddress,
        input.signedMessage,
      );
    }),
  handleReferral: createTRPCPublicProcedure
    .input(
      z.object({
        referredUserWalletAddress: z.string().min(1, "Invalid wallet address"),
        referralCode: z.string().length(8, "Invalid referral code"),
        signedMessage: cosmosSignedMessage,
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.referralService.handleReferral(
        input.referredUserWalletAddress,
        input.referralCode,
        input.signedMessage,
      );
    }),
});
