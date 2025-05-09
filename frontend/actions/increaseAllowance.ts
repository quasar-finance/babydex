import type { Account, Chain, CometBftRpcSchema, Transport } from "cosmi/types";
import { type ExecuteReturnType } from "cosmi/client";
import { ClientWithActions } from "~/multisig/client/types";

export type IncreaseAllowanceParameters = {
  sender: string;
  address: string;
  spender: string;
  amount: string;
};

export type IncreaseAllowanceReturnType = Promise<ExecuteReturnType>;

export async function increaseAllowance<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: ClientWithActions<Transport, C, A, CometBftRpcSchema>,
  parameters: IncreaseAllowanceParameters,
): IncreaseAllowanceReturnType {
  const { address, sender, spender, amount } = parameters;

  const execMsg = buildIncreaseAllowanceMsg({tokenAddress: address, ...parameters})

  return await client.execute(execMsg);
}

export type IncreaseAllowanceMsgParams = {
  sender: string;
  tokenAddress: string;
  spender: string;
  amount: string;
  expires?: { at_height?: number; at_time?: number; never?: {} };
};

export function buildIncreaseAllowanceMsg({
  sender,
  tokenAddress,
  spender,
  amount,
  expires,
}: IncreaseAllowanceMsgParams) {
  const msg = {
    increase_allowance: {
      spender,
      amount,
      ...(expires ? { expires } : {}),
    },
  };

  const execute = {
    address: tokenAddress,
    message: msg,
    funds: [],
  };

  return { sender, execute };
}
