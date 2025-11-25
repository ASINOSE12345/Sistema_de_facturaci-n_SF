// ============================================================================
// CURRENCY EXCHANGE SERVICE
// ============================================================================

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

const rateCache: Map<string, { rate: number; timestamp: Date }> = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const FALLBACK_RATES: Record<string, number> = {
  'USD_EUR': 0.92,
  'USD_ARS': 350.0,
  'USD_MXN': 17.5,
  'EUR_USD': 1.09,
  'EUR_ARS': 380.0,
  'EUR_MXN': 19.0,
  'ARS_USD': 0.0029,
  'ARS_EUR': 0.0026,
  'MXN_USD': 0.057,
  'MXN_EUR': 0.052,
};

export class CurrencyService {
  /**
   * Get exchange rate between two currencies
   */
  static async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const cacheKey = `${from}_${to}`;
    const cached = rateCache.get(cacheKey);

    // Check cache
    if (cached && Date.now() - cached.timestamp.getTime() < CACHE_DURATION) {
      console.log(`Using cached rate for ${cacheKey}: ${cached.rate}`);
      return cached.rate;
    }

    // Use fallback rates (in production, call exchangerate-api.com)
    const rate = FALLBACK_RATES[cacheKey];

    if (!rate) {
      console.warn(`No exchange rate found for ${cacheKey}, using 1:1`);
      return 1;
    }

    // Cache the rate
    rateCache.set(cacheKey, { rate, timestamp: new Date() });
    console.log(`Cached new rate for ${cacheKey}: ${rate}`);

    return rate;
  }

  /**
   * Convert amount from one currency to another
   */
  static async convert(amount: number, from: string, to: string): Promise<number> {
    const rate = await this.getExchangeRate(from, to);
    const converted = amount * rate;
    return Math.round(converted * 100) / 100;
  }

  /**
   * Format currency with symbol
   */
  static formatCurrency(amount: number, currency: string): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      ARS: '$',
      MXN: '$',
    };

    const symbol = symbols[currency] || currency;
    const formatted = amount.toFixed(2);

    return `${symbol}${formatted}`;
  }

  /**
   * Get all supported currencies
   */
  static getSupportedCurrencies(): string[] {
    return ['USD', 'EUR', 'ARS', 'MXN'];
  }

  /**
   * Clear rate cache
   */
  static clearCache(): void {
    rateCache.clear();
    console.log('Currency rate cache cleared');
  }
}
