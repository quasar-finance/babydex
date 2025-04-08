import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { queryContractSmart } from "cosmi/client";

export type GetCw20BalanceParameters = {
  address: string;
  owner: string;
};

export type GetCw20BalanceReturnType = Promise<{
  balance: string;
}>;

export async function getCw20Balance<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: GetCw20BalanceParameters,
): GetCw20BalanceReturnType {
  const { address, owner } = parameters;

  return await queryContractSmart(client, {
    address,
    msg: {
      balance: { address: owner },
    },
  });
}
