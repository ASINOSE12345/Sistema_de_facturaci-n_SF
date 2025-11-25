// ============================================================================
// SETTINGS CONTROLLER - System settings management
// ============================================================================

import { Request, Response } from 'express';
import { prisma } from '../config/database';

/**
 * GET /api/settings - Get user settings
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    let settings = await prisma.settings.findUnique({
      where: { userId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId,
          emailFromName: '',
          emailFromAddress: '',
          emailReplyTo: '',
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
          smtpSecure: true,
          invoicePrefix: 'INV',
          nextInvoiceNumber: 1,
          defaultCurrency: 'USD',
          defaultTaxRate: 0,
          defaultPaymentTerms: 30,
        },
      });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

/**
 * PUT /api/settings - Update user settings
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      emailFromName,
      emailFromAddress,
      emailReplyTo,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpSecure,
      invoicePrefix,
      nextInvoiceNumber,
      defaultCurrency,
      defaultTaxRate,
      defaultPaymentTerms,
      bankName,
      bankAccountHolder,
      bankAccountNumber,
      bankRoutingNumber,
      bankSwiftCode,
      paymentInstructions,
    } = req.body;

    // Check if settings exist
    const existingSettings = await prisma.settings.findUnique({
      where: { userId },
    });

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { userId },
        data: {
          emailFromName,
          emailFromAddress,
          emailReplyTo,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPassword,
          smtpSecure,
          invoicePrefix,
          nextInvoiceNumber,
          defaultCurrency,
          defaultTaxRate,
          defaultPaymentTerms,
          bankName,
          bankAccountHolder,
          bankAccountNumber,
          bankRoutingNumber,
          bankSwiftCode,
          paymentInstructions,
        },
      });
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          userId,
          emailFromName,
          emailFromAddress,
          emailReplyTo,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPassword,
          smtpSecure,
          invoicePrefix,
          nextInvoiceNumber,
          defaultCurrency,
          defaultTaxRate,
          defaultPaymentTerms,
          bankName,
          bankAccountHolder,
          bankAccountNumber,
          bankRoutingNumber,
          bankSwiftCode,
          paymentInstructions,
        },
      });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
