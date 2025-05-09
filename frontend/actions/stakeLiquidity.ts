import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import type { AssetInfo } from "@towerfi/types";

import { execute, type ExecuteReturnType } from "cosmi/client";
import { toUtf8 } from "cosmi/utils";
import { toBase64 } from "cosmi/utils";
import { ClientWithActions } from "~/multisig/client/types";

export type StakeLiquidityParameters = {
  sender: string;
  lpTokenAddress: string;
  incentiveAddress: string;
  amount: string;
  recipient?: string;
};

export type StakeLiquidityReturnType = ExecuteReturnType;

export async function stakeLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: ClientWithActions<Transport, C, A, CometBftRpcSchema>,
  parameters: StakeLiquidityParameters,
): StakeLiquidityReturnType {
  const { sender, lpTokenAddress, incentiveAddress, amount, recipient } = parameters;

  return await client.execute({
    sender,
    execute: {
      address: lpTokenAddress,
      message: {
        send: {
          contract: incentiveAddress,
          amount,
          msg: toBase64(toUtf8(JSON.stringify({ deposit: { recipient } }))),
        },
      },
    },
  });
}
