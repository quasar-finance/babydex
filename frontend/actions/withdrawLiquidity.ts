import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { execute, type ExecuteReturnType, executeMultiple } from "cosmi/client";
import { toUtf8, toBase64 } from "cosmi/utils";

export type WithdrawLiquidityParameters = {
  sender: string;
  lpTokenAddress: string;
  poolAddress: string;
  amount: string;
  incentiveAddress: string;
};

export type WithdrawLiquidityReturnType = ExecuteReturnType;

export async function withdrawLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: WithdrawLiquidityParameters,
): WithdrawLiquidityReturnType {
  const { sender, lpTokenAddress, poolAddress, amount, incentiveAddress } =
    parameters;

  return await executeMultiple(client, {
    sender,
    execute: [
      {
        address: incentiveAddress,
        message: {
          withdraw: {
            amount,
            lp_token: lpTokenAddress,
          },
        },
      },
      {
        address: lpTokenAddress,
        message: {
          send: {
            contract: poolAddress,
            amount: amount,
            msg: toBase64(toUtf8(JSON.stringify({ withdraw_liquidity: {} }))),
          },
        },
      },
    ],
  });
}
