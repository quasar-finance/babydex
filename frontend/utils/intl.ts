import BigNumber from "bignumber.js";

export function IntlAddress(address: string): string {
  return address.slice(0, 4).concat("...") + address.substring(address.length - 6);
}

export function convertMicroDenomToDenom(
  amount?: number | string,
  decimals = 6,
  fixed = 2,
  rounded = true,
) {
  if (!amount) return 0;
  if (typeof amount === "string") {
    amount = Number(amount);
  }

  amount = amount / 10 ** decimals;

  if (rounded) {
    const factor = 10 ** fixed;
    amount = Math.floor(amount * factor) / factor;
  }

  return Number.isNaN(amount) ? 0 : Number(amount.toFixed(fixed));
}

export function convertDenomToMicroDenom(amount: number | string, decimals = 6): string {
  const result = BigNumber(amount)
    .multipliedBy(new BigNumber(10).pow(decimals))
    .integerValue(BigNumber.ROUND_FLOOR);
  return result.isNaN() ? "0" : result.toFixed();
}

export function formatCurrency(
  number: number,
  currency: "usd" | "eur",
  minDigits?: number,
  maxDigits?: number,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
    //@ts-ignore
    roundingMode: "floor",
  }).format(number);
}

export function formatNumber(number: number | undefined, minDigits?: number, maxDigits?: number) {
  if (!number) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
    //@ts-ignore
    roundingMode: "floor",
  }).format(number);
}

export function nFormatter(num: number, digits: number, digitsFrom?: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(item.value < (digitsFrom || 1e6) ? 0 : digits).replace(rx, "$1") +
        item.symbol
    : "0";
}

export function graphDateFormatter(date: string, format: "month"): string {
  return new Date(date).toLocaleString("default", { month: "long" });
}

export function graphTickYFormatter(value: number, type: "apy" | "tvl" | "profit"): string {
  switch (type) {
    case "apy":
      return value + "%";
    case "tvl":
      return "$" + nFormatter(value, 1);
    case "profit":
      return "$" + nFormatter(value, 2, 1);
    default:
      return value.toString();
  }
}

export const toPercentage = (num: string | number, decimals = 0): string => {
  if (typeof num === "string" && num.includes("-")) return "-";

  const percentage = Number(num) * 100;
  if (percentage < 1 && percentage > 0) return `${percentage.toFixed(1)}%`;

  return decimals
    ? `${percentage.toFixed(decimals)}%`
    : `${Math.floor(percentage).toFixed(decimals)}%`;
};
