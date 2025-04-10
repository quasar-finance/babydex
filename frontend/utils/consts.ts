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
