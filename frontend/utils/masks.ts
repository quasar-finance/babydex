export function assetNumberMask(value: string): string | null {
  const regex = /^\d+(\.\d{0,18})?$/;
  const v = value.replaceAll(",", ".");
  if (v === "" || regex.test(v)) return v;
  return null;
}

export function addressShorten(address: string, start = 6, end = 4): string {
  if (!address) {
    return "";
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
