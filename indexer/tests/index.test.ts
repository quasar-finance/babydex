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

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool balances by addresses', async () => {
  const res = await indexer.getPoolBalancesByPoolAddresses([
    "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
    "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
    "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
    "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
    "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
    "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
    "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
    "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
    "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
  ]);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});

test('get current pool volumes', async () => {
  const res = await indexer.getCurrentPoolVolumes(1, 100);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});

test('get pool volumes by addresses', async () => {
  const res = await indexer.getPoolVolumesByPoolAddresses([
    "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
    "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
    "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
    "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
    "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
    "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
    "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
    "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
    "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
  ]);

  console.log(res);

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
      "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
      "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
      "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
      "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
      "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
      "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
      "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
      "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
      "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
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
    [
      "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
      "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
      "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
      "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
      "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
      "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
      "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
      "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
      "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
    ]
  );

  expect(res.length).toBeGreaterThan(0);
});

test('get pool metrics by addresses', async () => {
  const res = await indexer.getPoolMetricsByPoolAddresses([
    "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
    "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
    "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
    "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
    "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
    "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
    "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
    "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
    "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
  ]);

  console.log(res);

  // expect(res.length).toBeGreaterThan(0);
});

test('get pool metrics by addresses with start date', async () => {
  const now = new Date();
  const startDate = new Date(now);

  // 7 days ago
  startDate.setDate(now.getDate() - 7);

  const res = await indexer.getPoolMetricsByPoolAddresses([
    "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
    "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
    "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
    "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
    "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
    "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
    "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
    "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
    "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
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
    "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
    "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
    "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
    "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
    "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
    "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
    "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
    "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
    "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
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
    "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
    "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
    "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
    "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
    "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
    "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
    "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
    "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
    "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
  ], null, endDate);

  console.log(res);

  expect(res.length).toBeGreaterThan(0);
});
