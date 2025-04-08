import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import type { Currency } from "@towerfi/types";

import { execute, type ExecuteReturnType } from "cosmi/client";
import { setInnerValueToAsset } from "@towerfi/trpc";

export type AddLiquidityParameters = {
  sender: string;
  poolAddress: string;
  autoStake?: boolean;
  minLpToReceive?: string;
  receiver?: string;
  slipageTolerance: string;
  assets: {
    amount: string;
    info: Currency;
  }[];
};

export type AddLiquidityReturnType = ExecuteReturnType;

export async function addLiquidity<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: AddLiquidityParameters,
): AddLiquidityReturnType {
  const { sender, poolAddress, slipageTolerance, autoStake, minLpToReceive, assets, receiver } =
    parameters;

  return await execute(client, {
    execute: {
      address: poolAddress,
      message: {
        provide_liquidity: {
          receiver,
          auto_stake: autoStake,
          min_lp_to_receive: minLpToReceive,
          assets: assets.map(({ info, amount }) => ({
            info: setInnerValueToAsset(info),
            amount,
          })),
          slippage_tolerance: slipageTolerance,
        },
      },
      funds: assets
        .filter((a) => a.info.type !== "cw-20")
        .map(({ info, amount }) => ({
          denom: info.denom,
          amount,
        })),
    },
    sender,
  });
}
