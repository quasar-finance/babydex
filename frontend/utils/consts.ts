import type {
  BaseCurrency,
  CW20Currency,
  PoolIncentive,
  PoolMetricSerialized,
} from "@towerfi/types";
import { isTestnet } from "./global";

export const navLinks: { label: string; to: string; isDisabled?: boolean; isExternal?: boolean }[] =
  [
    { label: "Swap", to: "/swap" },
    { label: "Pools", to: "/pools" },
    { label: "Dashboard", to: "/dashboard" },
    ...(isTestnet ? [{ label: "Faucet", to: "/faucet" }] : []),
  ];

export const socialLinks: {
  label: string;
  href: string;
  icon: "discord" | "twitter" | "telegram";
}[] = [
  {
    label: "Twitter",
    href: "https://x.com/tower",
    icon: "twitter",
  },
  {
    label: "Discord",
    href: "https://discord.com/invite/tower",
    icon: "discord",
  },
  {
    label: "Telegram",
    href: "https://t.me/tower",
    icon: "telegram",
  },
];

export const supportLinks: { label: string; href: string; isExternal?: boolean }[] = [
  {
    label: "About",
    href: "https://www.tower.fi/",
    isExternal: true,
  },
  {
    label: "Docs",
    href: "https://docs.tower.fi/",
    isExternal: true,
  },
  {
    label: "Privacy Policy",
    href: "https://www.tower.fi/privacy-policy",
    isExternal: true,
  },
  {
    label: "Terms of Use",
    href: "https://www.tower.fi/terms-of-use",
    isExternal: true,
  },
];

export const blockedPoolAddresses = [
  "bbn1xt4ahzz2x8hpkc0tk6ekte9x6crw4w6u0r67cyt3kz9syh24pd7s4m2t0z",
  "bbn1ma0g752dl0yujasnfs9yrk6uew7d0a2zrgvg62cfnlfftu2y0egqvustk6",
  "bbn1w798gp0zqv3s9hjl3jlnwxtwhykga6rn93p46q2crsdqhaj3y4gsxallqs",
  "bbn1xsmqvl8lqr2uwl50aetu0572rss9hrza5kddpfj9ky3jq80fv2tssfrw9q",
  "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
  "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
  "bbn16slnlmtu7w5hjfwyzucwm75c3kuz40jztckp2766zttdu962tndqy2zks5",
  "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
  // old union pools
  "bbn134wsfa05dzx0xjg3raanxchg5j00hma64570yufpuw4zt6dzffusuj8ekq",
  "bbn17rrvcj20v275r5lcerxa043zmvuhzeucgrv5zlcuaewfp003nzds0kxjhd",
  "bbn1j7wxhf54dsn8a0jhhfnzyr8dk5xpmv53tsxe6fsa3eyj2yhp3gzsvr6waa",
  "bbn15hjqfzaffh0f2tcdgs5tk30fnhdu2e5lre98ef363a72p2pyl2nsfe4ag7",
  "bbn1zz74gvmq6ss3pg5vgahvx47ugpfzr80qu75l97lf2ggdgxq04ddqhawv8s",
  "bbn1apkgj87fgfsq84swvkyfaemrq7t4deuh60887lek0hkgdjh5fj0qvfa8fj",
  "bbn1vdd0h0263cxa4fa5fehl85ekyxl9a4wqa9rq0gldxunyntck4pts9h6x7y",
  "bbn1qew58vlyt7sx0pf73qq56qrl749456c9ft6tyv2w7q6camhkc7cs8stvlk",
  "bbn1naazzhhz5k92m26ap6phqmht5d8js52mg9uke2wynenqzzn6s63qtjgt7e",
  "bbn10rktvmllvgctcmhl5vv8kl3mdksukyqf2tdveh8drpn0sppugwwq2wykr0",
  "bbn1fur82ejcye82qqeah83v2tndt2m2l3y0ceypdkxe50rl0jj8xxys30zhkr",
  "bbn1csgj9nugf2dgq2hu4zmm3986ss038ehr3c82ty6hr00drh37peus4fqz5l",
  "bbn1z2wr8jmxmpe8x3j25rl8360pfl4w9p3ry3dpss90yuek4je4wgxq8526rl",
  "bbn13tt9669vsv5x80ncckykq4gnvv3ex33vumpe8rmlxemgk76mstysf0q3qx",
  "bbn1z7quf5t6g7spjnu2qhcp2x2ksnz4zfut9k73uutpg2q95dd008fqp2q9jt",
  "bbn10l67n20j7cjxu83a6yrdyqqln6mrcq3844c3wccr7qk0vn5j0laq8j32ml",
  "bbn1x4kzffnyd7jkldual9xkp2hu22g5vs0k8kuw847mtkevs8pcec5s0rzqm0",
  "bbn1yset4m9m6lrpyz7s8nlc2r2adretctcjvfzsx9akf2dj6c95xqmq4g4z4r",
  "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
  "bbn1hquvz7s2wm44snh4rcmqe9mx757xgacw3p5h4q23crgwg2n3pk9quhu0fg",
  "bbn1lpxsk8a8dxdpy8r6yqlz0gmjc7427wg9h25sj46c8d6jaglmzxsq6u09de",
  "bbn1pptvg76q2kfhzvpnsadz2ws2y6e0fvafzy3vkyak0fpmyzrc94qqnv0ark",
  "bbn1rdr5nhhcuawc8y34llx3urmtlf9yszfluhyhhj9ctypk4tnkg0nq7ywdxw",
];

export function DefaultPoolMetric(): PoolMetricSerialized {
  return {
    pool_address: "",
    height: "0",
    token0_denom: "",
    token0_balance: "0",
    token0_decimals: 0,
    token0_price: 0,
    token0_swap_volume: 0,
    token1_denom: "",
    token1_balance: "0",
    token1_decimals: 0,
    token1_price: 0,
    token1_swap_volume: 0,
    tvl_usd: 0,
    average_apr: 0,
    lp_token_address: "",
    total_incentives: "0",
    metric_start_height: null,
    metric_end_height: null,
  };
}

export function DefaultPoolIncentive(): PoolIncentive {
  return {
    lp_token_address: "",
    pool_address: "",
    rewards_per_second: 0,
    reward_token: "",
    total_incentives: "",
    token_decimals: 0,
    start_ts: "",
    end_ts: "",
  };
}

export function DefaultBaseCurrency(): BaseCurrency {
  return {
    name: "",
    symbol: "",
    denom: "",
    decimals: 0,
    logoURI: "",
  };
}

export function DefaultCW20Currency(): CW20Currency {
  return {
    ...DefaultBaseCurrency(),
    type: "cw-20",
    contractAddress: "",
  };
}
