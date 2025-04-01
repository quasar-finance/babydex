import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { execute, type ExecuteReturnType } from "cosmi/client";

export type ClaimRewardsParameters = {
  incentiveAddress: string;
  sender: string;
  lpTokens: string[];
};

export type ClaimRewardsReturnType = ExecuteReturnType;

export async function claimRewards<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: ClaimRewardsParameters,
): ClaimRewardsReturnType {
  const { sender, incentiveAddress, lpTokens } = parameters;

  return await execute(client, {
    sender,
    execute: {
      address: incentiveAddress,
      message: {
        claim_rewards: {
          lp_tokens: lpTokens,
        },
      },
    },
  });
}
