import { executeMultiple, type ExecuteReturnType } from "cosmi/client";
import type { Chain, Account, CometBftRpcSchema, Transport } from "cosmi/types";
import type { ClientWithActions } from "~/multisig/client/types";
import { setInnerValueToAsset } from "@towerfi/trpc";
import { Currency } from "@towerfi/types";
import { buildIncreaseAllowanceMsg } from "./increaseAllowance";

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
  return await client.executeMultiple({
    execute: execMsgs,
    sender,
  });
}

export type AddLiquidityMsgParams = {
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

export function buildAddLiquidityMsg({
  sender,
  poolAddress,
  slipageTolerance,
  autoStake,
  minLpToReceive,
  assets,
  receiver,
}: AddLiquidityMsgParams) {
  // TODO potential improvement would we to get allowance and subtract

  // Create increase allowance messages for CW20 assets
  const cw20Assets = assets.filter(asset => asset.info.type === "cw-20");
  const increaseAllowanceMsgs = cw20Assets.map(asset => 
    buildIncreaseAllowanceMsg({
      sender,
      tokenAddress: asset.info.denom,
      spender: poolAddress,
      amount: asset.amount,
    })
  );

  const provideLiquidityMsg = {
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
  };

  return {
    sender,
    execMsgs: [...increaseAllowanceMsgs.map(msg => msg.execute), provideLiquidityMsg],
  };
}

