import {expect, test} from 'vitest';
import {createIndexerService} from '../src/';
import {IndexerDbCredentials, views} from "../src/indexer";
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

test('check all views', async () => {
  for (const view in views) {
    const res = await indexer.queryView(view as keyof typeof views);
    expect(res.length).toBeGreaterThan(0);
  }
});

test('get current pool balances', async () => {
  const res = await indexer.getCurrentPoolBalances(1, 100);

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
  const res = await indexer.getCurrentPoolVolumes(1, 100);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool volumes by addresses', async () => {
  const res = await indexer.getPoolVolumesByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ]);

  expect(res.length).toBeGreaterThan(0);
});

test('get current pool apr', async () => {
  const res = await indexer.getCurrentPoolAprs(365, 1, 100);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool apr by addresses', async () => {
  const res = await indexer.getPoolAprsByPoolAddresses(
    365,
    [
      "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
      "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
    ]);

  expect(res.length).toBe(2);
});

test('get current pool incentives', async () => {
  const res = await indexer.getCurrentPoolIncentives(365, 1, 100);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool incentives by addresses', async () => {
  const res = await indexer.getPoolIncentivesByPoolAddresses(
    365,
    ["bbn1vkh603t635w73yndx3x92f9d9ykk7etr7fs274d9q0qdeeut0qhqcsz3qd"]
  );

  expect(res.length).toBeGreaterThan(0);
});

test('get pool metrics by addresses', async () => {
  const res = await indexer.getPoolMetricsByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ]);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool metrics by addresses with start date', async () => {
  const now = new Date();
  const startDate = new Date(now);

  // 7 days ago
  startDate.setDate(now.getDate() - 7);

  const res = await indexer.getPoolMetricsByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ], startDate);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool metrics by addresses with end date', async () => {
  const now = new Date();
  const endDate = new Date(now);

  // 7 days ago
  endDate.setDate(now.getDate() - 7);

  const res = await indexer.getPoolMetricsByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ], null, endDate);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool metrics by addresses with start and end date', async () => {
  const now = new Date();
  const startDate = new Date(now);
  const endDate = new Date(now);

  startDate.setDate(now.getDate() - 2);
  endDate.setDate(now.getDate() - 1);

  const res = await indexer.getPoolMetricsByPoolAddresses([
    "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
    "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu",
  ], null, endDate);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});
