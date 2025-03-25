import {expect, test} from 'vitest';
import {createIndexerService} from '../src/';
import type {IndexerDbCredentials} from "../src/indexer";
import sanitizedConfig from "./config";

const config = {
  host: sanitizedConfig.SUPABASE_HOST,
  port: sanitizedConfig.SUPABASE_PORT,
  user: sanitizedConfig.SUPABASE_USER,
  password: sanitizedConfig.SUPABASE_PW,
  database: sanitizedConfig.SUPABASE_DB,
  ssl: sanitizedConfig.SUPABASE_SSL,
} as IndexerDbCredentials;

const indexer = createIndexerService(config);

test('check test database access', async () => {
  const res = await indexer.queryView("addLiquidity");

  expect(res.length).toBeGreaterThan(0);
});

test('get current pool balances', async () => {
  const res = await indexer.getCurrentPoolBalances(100, 0);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool balances by addresses', async () => {
  const res = await indexer.getPoolBalancesByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ]);

  expect(res.length).toBeGreaterThan(0);
});

test('get current pool volumes', async () => {
  const res = await indexer.getCurrentPoolVolumes(0, 100);

  // expect(res.length).toBeGreaterThan(0);
  expect(res.length).toBe(0);
});

test('get pool volumes by addresses', async () => {
  const res = await indexer.getPoolVolumesByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ]);

  // expect(res.length).toBeGreaterThan(0);
  expect(res.length).toBe(0);
});

test('get current pool apr', async () => {
  const res = await indexer.getCurrentPoolApr(1, 100);

  expect(res.length).toBeGreaterThan(0);
  console.log(res);
});

test('get pool apr by addresses', async () => {
  const res = await indexer.getPoolAprByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ]);

  expect(res.length).toBeGreaterThan(0);
});
