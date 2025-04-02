export type UserPoolBalances = {
  owner: string;
  pool_address: string;
  staked_share_amount: number;
  unstaked_share_amount: number;
  total_share_amount: number;
  incentive_address: string | null;
  lpToken: string;
};
