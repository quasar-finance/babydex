export function assetNumberMask(value: string): string | null {
  const regex = /^\d+(\.\d{0,18})?$/;
  const v = value.replaceAll(",", ".");
  if (v === "" || regex.test(v)) return v;
  return null;
}
