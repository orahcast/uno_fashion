export const DEFAULT_USD_RATE = 1479;

/**
 * Converts Rwandan Francs (RWF) to US Dollars (USD) based on the current exchange rate.
 */
export function formatUSD(rwfAmount: number, rate: number = DEFAULT_USD_RATE): string {
  const validRate = rate > 0 ? rate : DEFAULT_USD_RATE;
  const usd = rwfAmount / validRate;

  if (usd >= 20) {
    return Math.round(usd).toLocaleString();
  }
  return usd.toFixed(2);
}
