import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { execute, type ExecuteReturnType } from "cosmi/client";

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
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: IncreaseAllowanceParameters,
): IncreaseAllowanceReturnType {
  const { address, sender, spender, amount } = parameters;

  return await execute(client, {
    sender,
    execute: {
      address,
      message: {
        increase_allowance: {
          spender,
          amount,
        },
      },
    },
  });
}
