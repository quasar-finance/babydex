import { Pool } from '~/interfaces';

export default class PoolService {
  async getPools(): Promise<Pool[]> {
    try {
      // todo:
      // - fetch available pools
      // - for each pool, determine asset prices, tvl and reserve
      // - convert into Pool[]
      return [];
    } catch (err) {
      return [];
    }
  }
}