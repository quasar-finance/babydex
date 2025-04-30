import { executeMultiple, type ExecuteReturnType } from "cosmi/client";
import type { Client, Chain, Account, CometBftRpcSchema, Transport } from "cosmi/types";
import { buildAddLiquidityMsg, type AddLiquidityMsgParams } from "~/actions/utils/addLiquidityMsg";

export type AddLiquidityParameters = AddLiquidityMsgParams;
export type AddLiquidityReturnType = ExecuteReturnType;

export async function addLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: AddLiquidityParameters,
): AddLiquidityReturnType {
  const { sender, execMsgs } = buildAddLiquidityMsg(parameters);
  return await executeMultiple(client, {
    execute: execMsgs,
    sender,
  });
}
