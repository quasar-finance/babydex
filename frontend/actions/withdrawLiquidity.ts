import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { execute, type ExecuteReturnType } from "cosmi/client";
import { toUtf8, toBase64 } from "cosmi/utils";

export type WithdrawLiquidityParameters = {
  sender: string;
  lpTokenAddress: string;
  poolAddress: string;
  amount: string;
};

export type WithdrawLiquidityReturnType = ExecuteReturnType;

export async function withdrawLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: WithdrawLiquidityParameters,
): WithdrawLiquidityReturnType {
  const { sender, lpTokenAddress, poolAddress, amount } = parameters;

  return await execute(client, {
    sender,
    execute: {
      address: lpTokenAddress,
      message: {
        send: {
          contract: poolAddress,
          amount: amount,
          msg: toBase64(toUtf8(JSON.stringify({ withdraw_liquidity: {} }))),
        },
      },
    },
  });
}
