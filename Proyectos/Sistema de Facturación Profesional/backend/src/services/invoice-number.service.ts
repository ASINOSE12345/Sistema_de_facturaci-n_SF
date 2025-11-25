// ============================================================================
// INVOICE NUMBERING SERVICE - Thread-safe invoice number generation
// ============================================================================

import { prisma } from '../config/database';

/**
 * Invoice number format configuration
 */
interface InvoiceNumberConfig {
  prefix: string;
  includeYear: boolean;
  paddingLength: number;
  separator: string;
}

/**
 * Generated invoice number result
 */
interface GeneratedInvoiceNumber {
  invoiceNumber: string;
  nextNumber: number;
  format: string;
}

/**
 * Invoice Numbering Service
 * Provides thread-safe invoice number generation using database transactions
 */
export class InvoiceNumberService {
  /**
   * Generate next invoice number for user
   * Thread-safe using Prisma transaction
   */
  static async generateInvoiceNumber(
    userId: string,
    customConfig?: Partial<InvoiceNumberConfig>
  ): Promise<GeneratedInvoiceNumber> {
    // Get or create user settings within a transaction for thread safety
    const result = await prisma.$transaction(async (tx) => {
      // Get settings with FOR UPDATE lock to prevent race conditions
      let settings = await tx.settings.findUnique({
        where: { userId },
      });

      // Create default settings if not exists
      if (!settings) {
        settings = await tx.settings.create({
          data: {
            userId,
            invoicePrefix: 'WY-INV',
            nextInvoiceNumber: 1,
            defaultCurrency: 'USD',
            defaultTaxRate: 0,
            defaultPaymentTerms: 30,
          },
        });
      }

      // Build configuration
      const config: InvoiceNumberConfig = {
        prefix: customConfig?.prefix || settings.invoicePrefix,
        includeYear: customConfig?.includeYear !== undefined ? customConfig.includeYear : true,
        paddingLength: customConfig?.paddingLength || 5,
        separator: customConfig?.separator || '-',
      };

      // Get current number
      const currentNumber = settings.nextInvoiceNumber;

      // Generate invoice number
      const invoiceNumber = this.formatInvoiceNumber(currentNumber, config);

      // Update next invoice number
      await tx.settings.update({
        where: { userId },
        data: {
          nextInvoiceNumber: currentNumber + 1,
        },
      });

      return {
        invoiceNumber,
        nextNumber: currentNumber + 1,
        format: this.getFormatDescription(config),
      };
    });

    console.log(`Generated invoice number for user ${userId}: ${result.invoiceNumber}`);
    return result;
  }

  /**
   * Format invoice number according to configuration
   */
  private static formatInvoiceNumber(
    number: number,
    config: InvoiceNumberConfig
  ): string {
    const parts: string[] = [];

    // Add prefix
    if (config.prefix) {
      parts.push(config.prefix);
    }

    // Add year if enabled
    if (config.includeYear) {
      const year = new Date().getFullYear();
      parts.push(year.toString());
    }

    // Add padded number
    const paddedNumber = number.toString().padStart(config.paddingLength, '0');
    parts.push(paddedNumber);

    // Join with separator
    return parts.join(config.separator);
  }

  /**
   * Get format description
   */
  private static getFormatDescription(config: InvoiceNumberConfig): string {
    const parts: string[] = [];

    if (config.prefix) {
      parts.push(config.prefix);
    }

    if (config.includeYear) {
      parts.push('YYYY');
    }

    parts.push('X'.repeat(config.paddingLength));

    return parts.join(config.separator);
  }

  /**
   * Preview next invoice number without generating it
   */
  static async previewNextInvoiceNumber(
    userId: string,
    customConfig?: Partial<InvoiceNumberConfig>
  ): Promise<{ preview: string; format: string }> {
    // Get current settings
    const settings = await prisma.settings.findUnique({
      where: { userId },
    });

    const nextNumber = settings?.nextInvoiceNumber || 1;

    // Build configuration
    const config: InvoiceNumberConfig = {
      prefix: customConfig?.prefix || settings?.invoicePrefix || 'WY-INV',
      includeYear: customConfig?.includeYear !== undefined ? customConfig.includeYear : true,
      paddingLength: customConfig?.paddingLength || 5,
      separator: customConfig?.separator || '-',
    };

    const preview = this.formatInvoiceNumber(nextNumber, config);
    const format = this.getFormatDescription(config);

    return { preview, format };
  }

  /**
   * Reset invoice numbering for new year
   */
  static async resetForNewYear(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      await prisma.settings.update({
        where: { userId },
        data: {
          nextInvoiceNumber: 1,
        },
      });

      console.log(`Reset invoice numbering for user ${userId}`);

      return {
        success: true,
        message: 'Invoice numbering reset to 1 for new year',
      };
    } catch (error: any) {
      console.error('Failed to reset invoice numbering:', error);
      return {
        success: false,
        message: `Failed to reset: ${error.message}`,
      };
    }
  }

  /**
   * Update invoice number configuration
   */
  static async updateConfiguration(
    userId: string,
    config: {
      prefix?: string;
      startingNumber?: number;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {};

      if (config.prefix !== undefined) {
        updateData.invoicePrefix = config.prefix;
      }

      if (config.startingNumber !== undefined) {
        updateData.nextInvoiceNumber = config.startingNumber;
      }

      await prisma.settings.update({
        where: { userId },
        data: updateData,
      });

      console.log(`Updated invoice configuration for user ${userId}`, config);

      return {
        success: true,
        message: 'Invoice configuration updated successfully',
      };
    } catch (error: any) {
      console.error('Failed to update invoice configuration:', error);
      return {
        success: false,
        message: `Failed to update: ${error.message}`,
      };
    }
  }

  /**
   * Check if invoice number already exists
   */
  static async invoiceNumberExists(invoiceNumber: string): Promise<boolean> {
    const existing = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    return existing !== null;
  }

  /**
   * Get invoice numbering statistics
   */
  static async getNumberingStats(userId: string): Promise<{
    currentNumber: number;
    totalInvoices: number;
    prefix: string;
    format: string;
    nextPreview: string;
  }> {
    const settings = await prisma.settings.findUnique({
      where: { userId },
    });

    const totalInvoices = await prisma.invoice.count({
      where: { userId },
    });

    const currentNumber = settings?.nextInvoiceNumber || 1;
    const prefix = settings?.invoicePrefix || 'WY-INV';

    const config: InvoiceNumberConfig = {
      prefix,
      includeYear: true,
      paddingLength: 5,
      separator: '-',
    };

    const format = this.getFormatDescription(config);
    const nextPreview = this.formatInvoiceNumber(currentNumber, config);

    return {
      currentNumber,
      totalInvoices,
      prefix,
      format,
      nextPreview,
    };
  }

  /**
   * Validate invoice number format
   */
  static validateInvoiceNumber(invoiceNumber: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Must not be empty
    if (!invoiceNumber || invoiceNumber.trim() === '') {
      errors.push('Invoice number cannot be empty');
    }

    // Must not be too long
    if (invoiceNumber.length > 50) {
      errors.push('Invoice number cannot be longer than 50 characters');
    }

    // Should contain at least one digit
    if (!/\d/.test(invoiceNumber)) {
      errors.push('Invoice number should contain at least one digit');
    }

    // Should not contain special characters (except - and _)
    if (/[^a-zA-Z0-9\-_]/.test(invoiceNumber)) {
      errors.push('Invoice number should only contain letters, numbers, hyphens, and underscores');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate custom invoice number (manual override)
   * Use with caution - bypasses automatic numbering
   */
  static async generateCustomInvoiceNumber(
    _userId: string,
    customNumber: string
  ): Promise<{ success: boolean; invoiceNumber?: string; error?: string }> {
    // Validate format
    const validation = this.validateInvoiceNumber(customNumber);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid invoice number format: ${validation.errors.join(', ')}`,
      };
    }

    // Check if already exists
    const exists = await this.invoiceNumberExists(customNumber);
    if (exists) {
      return {
        success: false,
        error: `Invoice number '${customNumber}' already exists`,
      };
    }

    return {
      success: true,
      invoiceNumber: customNumber,
    };
  }

  /**
   * Bulk generate invoice numbers
   * Useful for importing old invoices
   */
  static async bulkGenerateInvoiceNumbers(
    userId: string,
    count: number
  ): Promise<string[]> {
    const invoiceNumbers: string[] = [];

    await prisma.$transaction(async (tx) => {
      let settings = await tx.settings.findUnique({
        where: { userId },
      });

      if (!settings) {
        settings = await tx.settings.create({
          data: {
            userId,
            invoicePrefix: 'WY-INV',
            nextInvoiceNumber: 1,
            defaultCurrency: 'USD',
            defaultTaxRate: 0,
            defaultPaymentTerms: 30,
          },
        });
      }

      const config: InvoiceNumberConfig = {
        prefix: settings.invoicePrefix,
        includeYear: true,
        paddingLength: 5,
        separator: '-',
      };

      let currentNumber = settings.nextInvoiceNumber;

      for (let i = 0; i < count; i++) {
        const invoiceNumber = this.formatInvoiceNumber(currentNumber, config);
        invoiceNumbers.push(invoiceNumber);
        currentNumber++;
      }

      // Update next invoice number
      await tx.settings.update({
        where: { userId },
        data: {
          nextInvoiceNumber: currentNumber,
        },
      });
    });

    console.log(`Bulk generated ${count} invoice numbers for user ${userId}`);
    return invoiceNumbers;
  }
}
