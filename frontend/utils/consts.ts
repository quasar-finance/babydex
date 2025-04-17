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
  "bbn16slnlmtu7w5hjfwyzucwm75c3kuz40jztckp2766zttdu962tndqy2zks5"
];
