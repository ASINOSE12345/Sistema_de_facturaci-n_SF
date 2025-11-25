// ============================================================================
// INVOICES CONTROLLER - Invoice management with Prisma
// ============================================================================

import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { PDFService } from '../services/pdf.service';
import { EmailService } from '../services/email.service';
import { TaxService } from '../services/tax.service';
import { InvoiceNumberService } from '../services/invoice-number.service';

// GET /api/invoices - Get all invoices for authenticated user
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

// GET /api/invoices/:id - Get invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId, // Ensure user owns this invoice
      },
      include: {
        client: true,
        project: true,
        items: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

// POST /api/invoices - Create new invoice
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      clientId,
      projectId,
      invoiceDate,
      dueDate,
      currency,
      items,
      discount,
      notes,
    } = req.body;

    // Validate required fields
    if (!clientId || !invoiceDate || !dueDate || !items || items.length === 0) {
      res.status(400).json({
        error: 'Missing required fields: clientId, invoiceDate, dueDate, items',
      });
      return;
    }

    // Get client to snapshot data
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Calculate subtotal from items
    const calculatedSubtotal = items.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    );

    // Generate invoice number automatically
    const { invoiceNumber } = await InvoiceNumberService.generateInvoiceNumber(userId);

    // Calculate tax using TaxService
    const jurisdiction = req.body.jurisdiction || client.country || 'USA';
    const state = req.body.state || client.state;

    const taxCalculation = TaxService.calculateTax(
      calculatedSubtotal,
      jurisdiction,
      client.taxId,
      state
    );

    // Use calculated tax values
    const calculatedTaxRate = taxCalculation.taxRate;
    const taxAmount = taxCalculation.taxAmount;
    const calculatedTotal = taxCalculation.breakdown.total - (discount || 0);

    // Parse dates without timezone conversion
    const parsedInvoiceDate = new Date(invoiceDate + 'T00:00:00');
    const parsedDueDate = new Date(dueDate + 'T00:00:00');

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        clientId,
        projectId: projectId || null,
        invoiceNumber,
        invoiceDate: parsedInvoiceDate,
        dueDate: parsedDueDate,
        currency: currency || 'USD',
        subtotal: calculatedSubtotal,
        taxRate: calculatedTaxRate,
        taxAmount,
        discount: discount || 0,
        total: calculatedTotal,
        status: 'DRAFT',
        notes,
        jurisdiction,
        clientEmail: client.email,
        clientAddress: client.address,
        taxIdClient: client.taxId,
        paymentTerms: client.paymentTerms,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            hours: item.hours,
            rate: item.rate || item.unitPrice,
            unitPrice: item.unitPrice || item.rate,
            amount: item.amount,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

// PUT /api/invoices/:id - Update invoice
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!existingInvoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const {
      status,
      paidDate,
      paymentMethod,
      notes,
      sentDate,
    } = req.body;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status,
        paidDate: paidDate ? new Date(paidDate) : null,
        paymentMethod,
        notes,
        sentDate: sentDate ? new Date(sentDate) : null,
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

// DELETE /api/invoices/:id - Delete invoice
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Check if invoice exists and belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Only allow deleting DRAFT invoices
    if (invoice.status !== 'DRAFT') {
      res.status(400).json({
        error: 'Cannot delete invoice',
        message: 'Only invoices in DRAFT status can be deleted. This invoice is ' + invoice.status,
      });
      return;
    }

    // Delete invoice (will cascade to items)
    await prisma.invoice.delete({
      where: { id },
    });

    res.json({
      message: 'Invoice deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};

// GET /api/invoices/:id/pdf - Generate PDF for invoice
export const generateInvoicePDF = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Fetch invoice with all details
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Fetch user info for PDF header
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Fetch settings for payment information
    const settings = await prisma.settings.findUnique({
      where: { userId },
    });

    const userInfo = {
      businessName: user.businessName || user.name,
      email: user.email,
      phone: user.phone || undefined,
      address: user.address || '',
      city: user.city || undefined,
      state: user.state || undefined,
      postalCode: user.postalCode || undefined,
      taxId: user.taxId || undefined,
      bankName: settings?.bankName || undefined,
      bankAccountHolder: settings?.bankAccountHolder || undefined,
      bankAccountNumber: settings?.bankAccountNumber || undefined,
      bankRoutingNumber: settings?.bankRoutingNumber || undefined,
      bankSwiftCode: settings?.bankSwiftCode || undefined,
      paymentInstructions: settings?.paymentInstructions || undefined,
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoicePDF(invoice as any, userInfo);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

// POST /api/invoices/:id/send - Send invoice via email
export const sendInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Fetch invoice with all details
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Fetch user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Fetch settings
    const settings = await prisma.settings.findUnique({
      where: { userId },
    });

    const userInfo = {
      businessName: user.businessName || user.name,
      email: user.email,
      phone: user.phone || undefined,
      address: user.address || '',
      city: user.city || undefined,
      state: user.state || undefined,
      postalCode: user.postalCode || undefined,
      taxId: user.taxId || undefined,
      bankName: settings?.bankName || undefined,
      bankAccountHolder: settings?.bankAccountHolder || undefined,
      bankAccountNumber: settings?.bankAccountNumber || undefined,
      bankRoutingNumber: settings?.bankRoutingNumber || undefined,
      bankSwiftCode: settings?.bankSwiftCode || undefined,
      paymentInstructions: settings?.paymentInstructions || undefined,
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoicePDF(invoice as any, userInfo);

    // Send email with PDF attachment
    await EmailService.sendInvoiceEmail(invoice, invoice.client, pdfBuffer);

    // Update invoice status to SENT
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'SENT',
        sentDate: new Date(),
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.json({
      message: 'Invoice sent successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ error: 'Failed to send invoice' });
  }
};

// POST /api/invoices/:id/mark-paid - Mark invoice as paid
export const markInvoiceAsPaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { paymentMethod, paidDate } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Fetch invoice
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        client: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Update invoice status
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate: paidDate ? new Date(paidDate) : new Date(),
        paymentMethod: paymentMethod || 'Unknown',
      },
      include: {
        client: true,
        items: true,
      },
    });

    // Send payment confirmation email
    try {
      await EmailService.sendPaymentConfirmationEmail(updatedInvoice, invoice.client);
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: 'Invoice marked as paid successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Mark invoice as paid error:', error);
    res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
};

// Export as object for compatibility
export default {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  sendInvoice,
  markInvoiceAsPaid,
};
