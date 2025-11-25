// ============================================================================
// TAX SERVICE - Multi-jurisdiction tax calculation
// ============================================================================

export interface TaxConfig {
  jurisdiction: string;
  country: string;
  state?: string;
  salesTax?: number;
  localTax?: number;
  vat?: number;
  perceptions?: number[];
  taxType: 'SALES_TAX' | 'VAT' | 'MIXED';
}

export interface TaxBreakdown {
  baseTax: number;
  baseTaxAmount: number;
  localTax?: number;
  localTaxAmount?: number;
  perceptions?: Array<{
    name: string;
    rate: number;
    amount: number;
  }>;
  totalTaxRate: number;
  totalTaxAmount: number;
}

export interface TaxCalculationResult {
  jurisdiction: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  breakdown: TaxBreakdown;
}

// Tax rates by jurisdiction
const TAX_CONFIGS: Record<string, TaxConfig> = {
  'USA-WY': { jurisdiction: 'USA-WY', country: 'USA', state: 'WY', salesTax: 4.0, localTax: 1.0, taxType: 'SALES_TAX' },
  'ESP': { jurisdiction: 'ESP', country: 'ESP', vat: 21.0, taxType: 'VAT' },
  'ARG': { jurisdiction: 'ARG', country: 'ARG', vat: 21.0, perceptions: [2.5], taxType: 'MIXED' },
  'MEX': { jurisdiction: 'MEX', country: 'MEX', vat: 16.0, taxType: 'VAT' },
};

export class TaxService {
  static calculateTax(subtotal: number, jurisdiction: string): TaxCalculationResult {
    const config = TAX_CONFIGS[jurisdiction];
    if (!config) {
      return { jurisdiction, subtotal, taxRate: 0, taxAmount: 0, total: subtotal, breakdown: { baseTax: 0, baseTaxAmount: 0, totalTaxRate: 0, totalTaxAmount: 0 } };
    }

    let totalTaxAmount = 0;
    let totalTaxRate = 0;

    if (config.taxType === 'SALES_TAX') {
      const stateTax = (subtotal * (config.salesTax || 0)) / 100;
      const localTax = (subtotal * (config.localTax || 0)) / 100;
      totalTaxAmount = stateTax + localTax;
      totalTaxRate = (config.salesTax || 0) + (config.localTax || 0);
    } else if (config.taxType === 'VAT') {
      totalTaxAmount = (subtotal * (config.vat || 0)) / 100;
      totalTaxRate = config.vat || 0;
    } else if (config.taxType === 'MIXED') {
      const vat = (subtotal * (config.vat || 0)) / 100;
      const perceptions = config.perceptions?.reduce((sum, rate) => sum + (subtotal * rate) / 100, 0) || 0;
      totalTaxAmount = vat + perceptions;
      totalTaxRate = (config.vat || 0) + (config.perceptions?.reduce((sum, r) => sum + r, 0) || 0);
    }

    return {
      jurisdiction,
      subtotal,
      taxRate: Math.round(totalTaxRate * 100) / 100,
      taxAmount: Math.round(totalTaxAmount * 100) / 100,
      total: subtotal + totalTaxAmount,
      breakdown: {
        baseTax: config.vat || config.salesTax || 0,
        baseTaxAmount: Math.round(totalTaxAmount * 100) / 100,
        totalTaxRate: Math.round(totalTaxRate * 100) / 100,
        totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
      },
    };
  }
}
