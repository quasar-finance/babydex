import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import { queryContractSmart } from "cosmi/client";

export type GetCw20AllowanceParameters = {
  address: string;
  owner: string;
  spender: string;
};

export type GetCw20AllowanceReturnType = Promise<{
  allowance: string;
  expires: string;
}>;

export async function getCw20Allowance<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: GetCw20AllowanceParameters,
): GetCw20AllowanceReturnType {
  const { address, owner, spender } = parameters;

  return await queryContractSmart(client, {
    address,
    msg: {
      allowance: { owner, spender },
    },
  });
}
