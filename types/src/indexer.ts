export type UserPoolBalances = {
  owner: string;
  pool_address: string;
  staked_share_amount: number;
  unstaked_share_amount: number;
  total_share_amount: number;
  incentive_address: string | null;
  lpToken: string;
};

/**
 * @property {string} pool_address - The unique identifier or address of the liquidity pool.
 * @property {bigint} height - The block height on the blockchain at which these metrics were recorded.
 * @property {string} token0_denom - The denomination or identifier of the first token in the pool (e.g., "ubbn").
 * @property {bigint} token0_balance - The amount of the first token held in the pool at the given height.
 * @property {number} token0_decimals - The number of decimal places for the first token.
 * @property {number} token0_price - The current price of one unit of the first token (in USD).
 * @property {number} token0_swap_volume - The total volume of the first token swapped in/out over a period.
 * @property {string} token1_denom - The denomination or identifier of the second token in the pool.
 * @property {bigint} token1_balance - The amount of the second token held in the pool at the given height.
 * @property {number} token1_decimals - The number of decimal places for the second token.
 * @property {number} token1_price - The current price of one unit of the second token.
 * @property {number} token1_swap_volume - The total volume of the second token swapped in/out over a period.
 * @property {number} tvl_usd - The Total Value Locked in the pool in USD at the given height.
 * @property {number} average_apr - The Average Percentage Yield for providing liquidity to this pool.
 * @property {string} lp_token_address - The address of the Liquidity Provider (LP) token for this pool.
 * @property {bigint} total_incentives - The total amount of incentives distributed or active for this pool.
 * @property {bigint | null} metric_start_height - The starting block height for the calculation of certain metrics (e.g., swap volume, APR). Null if not applicable.
 * @property {bigint | null} metric_end_height - The ending block height for the calculation of certain metrics. Null if not applicable.
 */
export type PoolMetric = {
  pool_address: string;
  height: bigint;
  token0_denom: string;
  token0_balance: bigint;
  token0_decimals: number;
  token0_price: number;
  token0_swap_volume: number;
  token1_denom: string;
  token1_balance: bigint;
  token1_decimals: number;
  token1_price: number;
  token1_swap_volume: number;
  tvl_usd: number;
  average_apr: number;
  lp_token_address: string;
  total_incentives: bigint;
  metric_start_height: bigint | null;
  metric_end_height: bigint | null;
};


export interface PoolIncentive {
  lp_token_address: string;
  pool_address: string;
  rewards_per_second: number;
  reward_token: string,
  total_incentives: string;
  token_decimals: number;
}