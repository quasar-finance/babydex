import type { Currency } from "@towerfi/types";
import { setInnerValueToAsset } from "@towerfi/trpc";
import { buildIncreaseAllowanceMsg } from "./increaseAllowanceMsg";

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
    execMsgs: [...increaseAllowanceMsgs.map(msg => msg.execMsg), provideLiquidityMsg],
  };
}
