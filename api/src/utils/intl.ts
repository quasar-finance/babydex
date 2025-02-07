export function convertMicroDenomToDenom(amount?: number | string, decimals = 6, fixed = 2, rounded = true) {
  if (!amount) return 0;
  if (typeof amount === 'string') {
    amount = Number(amount);
  }

  amount = amount / Math.pow(10, decimals);

  if (rounded) {
    const factor = Math.pow(10, fixed);
    amount = Math.floor(amount * factor) / factor;
  }

  return isNaN(amount) ? 0 : Number(amount.toFixed(fixed));
}
