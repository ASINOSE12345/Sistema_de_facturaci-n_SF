// ============================================================================
// INVOICES ROUTES - Invoice management endpoints
// ============================================================================

import { Router } from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  sendInvoice,
  markInvoiceAsPaid,
} from '../controllers/invoices.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/invoices - Get all invoices for authenticated user
router.get('/', getInvoices);

// GET /api/invoices/:id/pdf - Generate PDF for invoice (must be before /:id)
router.get('/:id/pdf', generateInvoicePDF);

// POST /api/invoices/:id/send - Send invoice via email
router.post('/:id/send', sendInvoice);

// POST /api/invoices/:id/mark-paid - Mark invoice as paid
router.post('/:id/mark-paid', markInvoiceAsPaid);

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', getInvoiceById);

// POST /api/invoices - Create new invoice
router.post('/', createInvoice);

// PUT /api/invoices/:id - Update invoice
router.put('/:id', updateInvoice);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', deleteInvoice);

export default router;
