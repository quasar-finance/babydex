import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { execute, type ExecuteReturnType } from "cosmi/client";
import { ClientWithActions } from "~/multisig/client/types";

export type UnstakeLiquidityParameters = {
  sender: string;
  incentiveAddress: string;
  lpTokenAddress: string;
  amount: string;
};

export type UnstakeLiquidityReturnType = ExecuteReturnType;

export async function unstakeLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: ClientWithActions<Transport, C, A, CometBftRpcSchema>,
  parameters: UnstakeLiquidityParameters,
): UnstakeLiquidityReturnType {
  const { sender, incentiveAddress, lpTokenAddress, amount } = parameters;

  return await client.execute({
    sender,
    execute: {
      address: incentiveAddress,
      message: {
        withdraw: {
          amount,
          lp_token: lpTokenAddress,
        },
      },
    },
  });
}
