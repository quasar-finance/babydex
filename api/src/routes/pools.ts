import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { ContractService } from '../services/contracts.js';

const poolsRoute = new Hono<{
  Variables: {
    contracts: ContractService;
  };
}>();

const getPoolsSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  start_after: z.string().optional()
});

const simulateSwapSchema = z.object({
  offer_asset: z.object({
    info: z.any(),
    amount: z.string()
  }),
  ask_asset_info: z.any().optional()
});

poolsRoute.get('/', zValidator('query', getPoolsSchema), async (c) => {
  const { limit = 100, start_after } = c.req.valid('query');
  const contracts = c.get('contracts');
  
  const pools = await contracts.getPools(limit, start_after);
  
  return c.json({
    pools,
    count: pools.length
  });
});

poolsRoute.get('/:address', async (c) => {
  const address = c.req.param('address');
  const contracts = c.get('contracts');
  
  const [pool, shares, config] = await Promise.all([
    contracts.getPool(address),
    contracts.getPoolShares(address),
    contracts.getPoolConfig(address)
  ]);
  
  return c.json({
    pool,
    shares,
    config
  });
});

poolsRoute.get('/:address/shares', async (c) => {
  const address = c.req.param('address');
  const contracts = c.get('contracts');
  
  const shares = await contracts.getPoolShares(address);
  
  return c.json(shares);
});

poolsRoute.get('/:address/config', async (c) => {
  const address = c.req.param('address');
  const contracts = c.get('contracts');
  
  const config = await contracts.getPoolConfig(address);
  
  return c.json(config);
});

poolsRoute.post('/:address/simulate', zValidator('json', simulateSwapSchema), async (c) => {
  const address = c.req.param('address');
  const { offer_asset, ask_asset_info } = c.req.valid('json');
  const contracts = c.get('contracts');
  
  const simulation = await contracts.simulateSwap(address, offer_asset, ask_asset_info);
  
  return c.json(simulation);
});

poolsRoute.get('/:address/incentives', async (c) => {
  const address = c.req.param('address');
  const user = c.req.query('user');
  const contracts = c.get('contracts');
  
  const pool = await contracts.getPool(address);
  const incentives = await contracts.getIncentives(pool.liquidity_token, user);
  
  return c.json(incentives);
});

export default poolsRoute;