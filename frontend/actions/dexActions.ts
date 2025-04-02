import type { Transport, Chain, Account, Client } from "cosmi/types";

import {
  addLiquidity,
  type AddLiquidityParameters,
  type AddLiquidityReturnType,
} from "./addLiquidity";

import {
  withdrawLiquidity,
  type WithdrawLiquidityParameters,
  type WithdrawLiquidityReturnType,
} from "./withdrawLiquidity";

import {
  stakeLiquidity,
  type StakeLiquidityParameters,
  type StakeLiquidityReturnType,
} from "./stakeLiquidity";

import {
  unstakeLiquidity,
  type UnstakeLiquidityParameters,
  type UnstakeLiquidityReturnType,
} from "./unstakeLiquidity";

import {
  claimRewards,
  type ClaimRewardsParameters,
  type ClaimRewardsReturnType,
} from "./claimRewards";

export type DexActions<
  _transport extends Transport = Transport,
  _chain extends Chain | undefined = Chain | undefined,
  _account extends Account | undefined = Account | undefined,
> = {
  addLiquidity: (args: AddLiquidityParameters) => AddLiquidityReturnType;
  withdrawLiquidity: (args: WithdrawLiquidityParameters) => WithdrawLiquidityReturnType;
  stakeLiquidity: (args: StakeLiquidityParameters) => StakeLiquidityReturnType;
  unstakeLiquidity: (args: UnstakeLiquidityParameters) => UnstakeLiquidityReturnType;
  claimRewards: (args: ClaimRewardsParameters) => ClaimRewardsReturnType;
};

export function dexActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(client: Client<transport, chain, account>): DexActions<transport, chain, account> {
  return {
    addLiquidity: (args) => addLiquidity(client, args),
    withdrawLiquidity: (args) => withdrawLiquidity(client, args),
    stakeLiquidity: (args) => stakeLiquidity(client, args),
    unstakeLiquidity: (args) => unstakeLiquidity(client, args),
    claimRewards: (args) => claimRewards(client, args),
  };
}
