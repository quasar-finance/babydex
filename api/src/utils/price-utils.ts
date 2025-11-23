/**
 * Shared price calculation utilities
 * Consolidates price operations that were duplicated across AMM calculator services
 */

/**
 * Format price with proper decimal handling and exponential notation
 * Extracted from AMMCalculator and AMMCalculatorDB classes
 */
export function formatPrice(price: number): string {
  if (price === 0) return '0';
  
  // Use exponential notation for very small or very large numbers
  if (price < 0.000001 || price > 1000000) {
    return price.toExponential(6);
  }
  
  // Use fixed decimal notation for normal range
  return price.toFixed(8).replace(/\.?0+$/, '');
}

/**
 * Calculate spot price from pool reserves with decimal normalization
 * Extracted from both AMM calculator implementations
 */
export function calculateSpotPriceFromReserves(
  token0Balance: string | bigint,
  token1Balance: string | bigint,
  baseDecimals: number,
  targetDecimals: number
): number {
  const balance0Normalized = Number(token0Balance) / Math.pow(10, baseDecimals);
  const balance1Normalized = Number(token1Balance) / Math.pow(10, targetDecimals);
  
  if (balance0Normalized === 0) return 0;
  
  return balance1Normalized / balance0Normalized;
}

/**
 * Calculate bid and ask prices with spread
 * Common pattern used across price calculations
 */
export function calculateBidAsk(spotPrice: number, spread: number = 0.003): { bid: number; ask: number } {
  const bid = spotPrice * (1 - spread);
  const ask = spotPrice * (1 + spread);
  
  return { bid, ask };
}

/**
 * Normalize token amount by dividing by 10^decimals
 * Common pattern for handling token amounts
 */
export function normalizeTokenAmount(amount: string | bigint | number, decimals: number): number {
  return Number(amount) / Math.pow(10, decimals);
}

/**
 * Convert normalized amount back to token units
 */
export function denormalizeTokenAmount(amount: number, decimals: number): string {
  return Math.floor(amount * Math.pow(10, decimals)).toString();
}