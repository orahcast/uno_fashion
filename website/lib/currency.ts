export const DEFAULT_USD_RATE = 1479;

/**
 * Converts Rwandan Francs (RWF) to US Dollars (USD) based on the current exchange rate.
 * Rounds to whole numbers for amounts >= 20 for clean luxury formatting ($34, $68, $101),
 * or 2 decimal places for small amounts ($5.50).
 */
export function formatUSD(rwfAmount: number, rate: number = DEFAULT_USD_RATE): string {
  const validRate = rate > 0 ? rate : DEFAULT_USD_RATE;
  const usd = rwfAmount / validRate;

  if (usd >= 20) {
    return Math.round(usd).toLocaleString();
  }
  return usd.toFixed(2);
}
