import type { Account, Chain, Transport } from "cosmi/types";

import {
  type AddLiquidityParameters,
  type AddLiquidityReturnType,
  addLiquidity,
} from "./addLiquidity";

import {
  type WithdrawLiquidityParameters,
  type WithdrawLiquidityReturnType,
  withdrawLiquidity,
} from "./withdrawLiquidity";

import {
  type StakeLiquidityParameters,
  type StakeLiquidityReturnType,
  stakeLiquidity,
} from "./stakeLiquidity";

import {
  type UnstakeLiquidityParameters,
  type UnstakeLiquidityReturnType,
  unstakeLiquidity,
} from "./unstakeLiquidity";

import {
  type ClaimRewardsParameters,
  type ClaimRewardsReturnType,
  claimRewards,
} from "./claimRewards";

import {
  type GetCw20AllowanceParameters,
  type GetCw20AllowanceReturnType,
  getCw20Allowance,
} from "./getCw20Allowance";
import {
  type GetCw20BalanceParameters,
  type GetCw20BalanceReturnType,
  getCw20Balance,
} from "./getCw20Balance";

import type { ClientWithActions } from "~/multisig/client/types";
import {
  type IncreaseAllowanceParameters,
  type IncreaseAllowanceReturnType,
  increaseAllowance,
} from "./increaseAllowance";
import { type PoolSwapParameters, type PoolSwapReturnType, poolSwap } from "./poolSwap";

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
>(client: ClientWithActions<transport, chain, account>): DexActions<transport, chain, account> {
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
