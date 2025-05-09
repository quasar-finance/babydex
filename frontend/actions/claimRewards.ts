import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { execute, type ExecuteReturnType } from "cosmi/client";
import { ClientWithActions } from "~/multisig/client/types";

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
  client: ClientWithActions<Transport, C, A, CometBftRpcSchema>,
  parameters: ClaimRewardsParameters,
): ClaimRewardsReturnType {
  const { sender, incentiveAddress, lpTokens } = parameters;

  const execMsg = {
    address: incentiveAddress,
    message: {
      claim_rewards: {
        lp_tokens: lpTokens,
      },
    },
  };

  return await client.execute({
    execute: execMsg,
    sender,
  });
}
