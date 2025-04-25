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

  expect(res.length).toBeGreaterThan(0);
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
    "bbn1qew58vlyt7sx0pf73qq56qrl749456c9ft6tyv2w7q6camhkc7cs8stvlk",
    "bbn1g6yxz0avc7c6mzc6k64lm4t9fh668s0yp5fpm9u32wu4leg4yuhs0e54h2",
    "bbn16slnlmtu7w5hjfwyzucwm75c3kuz40jztckp2766zttdu962tndqy2zks5",
    "bbn1cduudfszcm9slm8qxlaqvnpzg2u0hkus94fe3pwt9x446dtw6eeqwvlnpk",
    "bbn1hs95lgvuy0p6jn4v7js5x8plfdqw867lsuh5xv6d2ua20jprkgeslpzjvl",
    "bbn1fur82ejcye82qqeah83v2tndt2m2l3y0ceypdkxe50rl0jj8xxys30zhkr",
    "bbn1z7quf5t6g7spjnu2qhcp2x2ksnz4zfut9k73uutpg2q95dd008fqp2q9jt",
    "bbn1apkgj87fgfsq84swvkyfaemrq7t4deuh60887lek0hkgdjh5fj0qvfa8fj",
    "bbn1zz74gvmq6ss3pg5vgahvx47ugpfzr80qu75l97lf2ggdgxq04ddqhawv8s",
    "bbn15hjqfzaffh0f2tcdgs5tk30fnhdu2e5lre98ef363a72p2pyl2nsfe4ag7",
    "bbn1naazzhhz5k92m26ap6phqmht5d8js52mg9uke2wynenqzzn6s63qtjgt7e",
    "bbn13tt9669vsv5x80ncckykq4gnvv3ex33vumpe8rmlxemgk76mstysf0q3qx",
    "bbn1z2wr8jmxmpe8x3j25rl8360pfl4w9p3ry3dpss90yuek4je4wgxq8526rl",
    "bbn1pptvg76q2kfhzvpnsadz2ws2y6e0fvafzy3vkyak0fpmyzrc94qqnv0ark",
    "bbn1hquvz7s2wm44snh4rcmqe9mx757xgacw3p5h4q23crgwg2n3pk9quhu0fg",
    "bbn10l67n20j7cjxu83a6yrdyqqln6mrcq3844c3wccr7qk0vn5j0laq8j32ml",
    "bbn17rrvcj20v275r5lcerxa043zmvuhzeucgrv5zlcuaewfp003nzds0kxjhd",
    "bbn134wsfa05dzx0xjg3raanxchg5j00hma64570yufpuw4zt6dzffusuj8ekq",
    "bbn1x4kzffnyd7jkldual9xkp2hu22g5vs0k8kuw847mtkevs8pcec5s0rzqm0",
    "bbn1j7wxhf54dsn8a0jhhfnzyr8dk5xpmv53tsxe6fsa3eyj2yhp3gzsvr6waa",
    "bbn1vdd0h0263cxa4fa5fehl85ekyxl9a4wqa9rq0gldxunyntck4pts9h6x7y",
    "bbn1csgj9nugf2dgq2hu4zmm3986ss038ehr3c82ty6hr00drh37peus4fqz5l",
    "bbn10rktvmllvgctcmhl5vv8kl3mdksukyqf2tdveh8drpn0sppugwwq2wykr0",
    "bbn1rdr5nhhcuawc8y34llx3urmtlf9yszfluhyhhj9ctypk4tnkg0nq7ywdxw",
    "bbn1lpxsk8a8dxdpy8r6yqlz0gmjc7427wg9h25sj46c8d6jaglmzxsq6u09de",
    "bbn1478sh2c7xgk2xufh32l3p4vsyeyd5xemqm6f2jrwz39wa9atgkps7z9d52",
    "bbn1yset4m9m6lrpyz7s8nlc2r2adretctcjvfzsx9akf2dj6c95xqmq4g4z4r",

  ]);

  console.log(res);

  expect(Object.keys(res).length).toBeGreaterThan(0);
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

  expect(Object.keys(res).length).toBeGreaterThan(0);
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

  expect(Object.keys(res).length).toBeGreaterThan(0);
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

  expect(Object.keys(res).length).toBeGreaterThan(0);
});

test('get incentive apr by addresses', async () => {
  const res = await indexer.getPoolIncentiveAprsByPoolAddresses([
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
