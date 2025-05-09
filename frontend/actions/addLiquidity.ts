import { executeMultiple, type ExecuteReturnType } from "cosmi/client";
import type { Chain, Account, CometBftRpcSchema, Transport } from "cosmi/types";
import type { ClientWithActions } from "~/multisig/client/types";
import { buildAddLiquidityMsg, type AddLiquidityMsgParams } from "~/actions/utils/addLiquidityMsg";

export type AddLiquidityParameters = AddLiquidityMsgParams;
export type AddLiquidityReturnType = ExecuteReturnType;

export async function addLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: ClientWithActions<Transport, C, A>,
  parameters: AddLiquidityParameters,
): AddLiquidityReturnType {
  const { sender, execMsgs } = buildAddLiquidityMsg(parameters);
  // TODO, make this call differentiate between cosmi base signing call and our multisig signing call
  return await client.executeMultiple({
    execute: execMsgs,
    sender,
  });
}
