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

import {
  getCw20Allowance,
  type GetCw20AllowanceParameters,
  type GetCw20AllowanceReturnType,
} from "./getCw20Allowance";
import {
  getCw20Balance,
  type GetCw20BalanceParameters,
  type GetCw20BalanceReturnType,
} from "./getCw20Balance";

import {
  increaseAllowance,
  type IncreaseAllowanceParameters,
  type IncreaseAllowanceReturnType,
} from "./increaseAllowance";
import { poolSwap, type PoolSwapParameters, type PoolSwapReturnType } from "./poolSwap";

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
  getCw20Allowance: (args: GetCw20AllowanceParameters) => GetCw20AllowanceReturnType;
  getCw20Balance: (args: GetCw20BalanceParameters) => GetCw20BalanceReturnType;
  increaseAllowance: (args: IncreaseAllowanceParameters) => IncreaseAllowanceReturnType;
  poolSwap: (args: PoolSwapParameters) => PoolSwapReturnType;
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
    getCw20Allowance: (args) => getCw20Allowance(client, args),
    getCw20Balance: (args) => getCw20Balance(client, args),
    increaseAllowance: (args) => increaseAllowance(client, args),
    poolSwap: (args) => poolSwap(client, args),
  };
}
