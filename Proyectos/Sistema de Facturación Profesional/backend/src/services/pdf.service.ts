// ============================================================================
// PDF SERVICE - Invoice PDF generation with Puppeteer
// ============================================================================

import puppeteer from 'puppeteer';
import { Invoice } from '@prisma/client';

interface InvoiceWithDetails extends Invoice {
  client?: {
    businessName: string;
    contactName: string;
    email: string;
    address: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}

interface UserInfo {
  businessName: string;
  email: string;
  phone?: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  taxId?: string;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankSwiftCode?: string;
  paymentInstructions?: string;
}

export class PDFService {
  /**
   * Generate invoice HTML template
   */
  private static generateInvoiceHTML(invoice: InvoiceWithDetails, userInfo: UserInfo): string {
    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    };

    const formatDate = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        'DRAFT': 'Borrador',
        'SENT': 'Enviada',
        'PAID': 'Pagada',
        'PENDING': 'Pendiente',
        'OVERDUE': 'Vencida',
        'CANCELLED': 'Cancelada',
        'draft': 'Borrador',
        'sent': 'Enviada',
        'paid': 'Pagada',
        'pending': 'Pendiente',
        'overdue': 'Vencida',
        'cancelled': 'Cancelada',
      };
      return statusMap[status] || status;
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            background: white;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
          }
          
          .company-info h1 {
            color: #2563eb;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .company-info p {
            color: #666;
            font-size: 13px;
            line-height: 1.5;
          }
          
          .invoice-title {
            text-align: right;
          }
          
          .invoice-title h2 {
            font-size: 32px;
            color: #1e40af;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .invoice-number {
            font-size: 16px;
            color: #666;
            font-weight: 600;
          }
          
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          
          .bill-to, .invoice-info {
            flex: 1;
          }
          
          .bill-to {
            margin-right: 40px;
          }
          
          .section-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
          }
          
          .client-details {
            background: #f9fafb;
            padding: 16px;
            border-radius: 6px;
            border-left: 4px solid #2563eb;
          }
          
          .client-details h3 {
            font-size: 16px;
            color: #111;
            margin-bottom: 4px;
            font-weight: 600;
          }
          
          .client-details p {
            color: #666;
            font-size: 13px;
            line-height: 1.6;
          }
          
          .invoice-meta {
            background: #f9fafb;
            padding: 16px;
            border-radius: 6px;
          }
          
          .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .meta-row:last-child {
            margin-bottom: 0;
          }
          
          .meta-label {
            color: #666;
            font-weight: 600;
            font-size: 13px;
          }
          
          .meta-value {
            color: #111;
            font-weight: 500;
            font-size: 13px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table thead {
            background: #1e40af;
            color: white;
          }
          
          .items-table th {
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .items-table th:last-child,
          .items-table td:last-child {
            text-align: right;
          }
          
          .items-table tbody tr {
            border-bottom: 1px solid #e5e7eb;
          }
          
          .items-table tbody tr:hover {
            background: #f9fafb;
          }
          
          .items-table td {
            padding: 16px 12px;
            font-size: 14px;
          }
          
          .item-description {
            color: #111;
            font-weight: 500;
          }
          
          .item-quantity,
          .item-rate {
            color: #666;
          }
          
          .item-amount {
            color: #111;
            font-weight: 600;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .totals {
            width: 350px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .total-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-top: 12px;
            border-top: 2px solid #2563eb;
          }
          
          .total-label {
            color: #666;
            font-weight: 600;
            font-size: 14px;
          }
          
          .total-value {
            color: #111;
            font-weight: 600;
            font-size: 14px;
          }
          
          .total-row.final .total-label,
          .total-row.final .total-value {
            font-size: 20px;
            color: #1e40af;
            font-weight: 700;
          }
          
          .notes-section {
            margin-top: 40px;
            padding: 20px;
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            border-radius: 6px;
          }
          
          .notes-section h4 {
            color: #92400e;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .notes-section p {
            color: #78350f;
            font-size: 13px;
            line-height: 1.6;
          }
          
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          .payment-terms {
            margin-top: 30px;
            padding: 16px;
            background: #eff6ff;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
          }

          .payment-terms h4 {
            color: #1e40af;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .payment-terms p {
            color: #1e40af;
            font-size: 13px;
          }

          .payment-info {
            margin-top: 20px;
            padding: 16px;
            background: #f0fdf4;
            border-radius: 6px;
            border-left: 4px solid #10b981;
          }

          .payment-info h4 {
            color: #047857;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .payment-details p {
            color: #065f46;
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 6px;
          }

          .payment-details p:last-child {
            margin-bottom: 0;
          }

          .payment-details strong {
            color: #047857;
            font-weight: 600;
            display: inline-block;
            min-width: 130px;
          }

          .payment-notes {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #d1fae5;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="invoice-header">
            <div class="company-info">
              <h1>${userInfo.businessName}</h1>
              <p>${userInfo.address}</p>
              ${userInfo.city ? `<p>${userInfo.city}, ${userInfo.state} ${userInfo.postalCode}</p>` : ''}
              <p>${userInfo.email}</p>
              ${userInfo.phone ? `<p>${userInfo.phone}</p>` : ''}
              ${userInfo.taxId ? `<p>Tax ID: ${userInfo.taxId}</p>` : ''}
            </div>
            <div class="invoice-title">
              <h2>INVOICE</h2>
              <div class="invoice-number">${invoice.invoiceNumber}</div>
            </div>
          </div>
          
          <!-- Invoice Details -->
          <div class="invoice-details">
            <div class="bill-to">
              <div class="section-title">Bill To</div>
              <div class="client-details">
                <h3>${invoice.client?.businessName}</h3>
                <p>${invoice.client?.contactName}</p>
                <p>${invoice.client?.email}</p>
                <p>${invoice.client?.address}</p>
                ${invoice.client?.city ? `<p>${invoice.client.city}, ${invoice.client.state} ${invoice.client.postalCode}</p>` : ''}
                <p>${invoice.client?.country}</p>
              </div>
            </div>
            
            <div class="invoice-info">
              <div class="section-title">Invoice Details</div>
              <div class="invoice-meta">
                <div class="meta-row">
                  <span class="meta-label">Invoice Date:</span>
                  <span class="meta-value">${formatDate(invoice.invoiceDate)}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Due Date:</span>
                  <span class="meta-value">${formatDate(invoice.dueDate)}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Status:</span>
                  <span class="meta-value" style="color: ${
                    invoice.status === 'PAID' ? '#059669' :
                    invoice.status === 'OVERDUE' ? '#dc2626' : '#f59e0b'
                  };">${formatStatus(invoice.status)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 15%;">Quantity</th>
                <th style="width: 17.5%;">Rate</th>
                <th style="width: 17.5%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items?.map(item => `
                <tr>
                  <td class="item-description">${item.description}</td>
                  <td class="item-quantity">${item.quantity}</td>
                  <td class="item-rate">${formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td class="item-amount">${formatCurrency(item.amount, invoice.currency)}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="totals-section">
            <div class="totals">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">${formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              ${invoice.discount > 0 ? `
                <div class="total-row">
                  <span class="total-label">Discount (${invoice.discount}%):</span>
                  <span class="total-value">-${formatCurrency(invoice.subtotal * (invoice.discount / 100), invoice.currency)}</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span class="total-label">Tax:</span>
                <span class="total-value">${formatCurrency(invoice.taxAmount, invoice.currency)}</span>
              </div>
              <div class="total-row final">
                <span class="total-label">Total:</span>
                <span class="total-value">${formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>
          
          <!-- Payment Terms -->
          <div class="payment-terms">
            <h4>Payment Terms</h4>
            <p>Payment is due within ${invoice.paymentTerms} days from the invoice date. Please make checks payable to ${userInfo.businessName}.</p>
          </div>

          <!-- Payment Information -->
          ${userInfo.bankName || userInfo.bankAccountNumber ? `
            <div class="payment-info">
              <h4>Payment Information</h4>
              <div class="payment-details">
                ${userInfo.bankName ? `<p><strong>Bank Name:</strong> ${userInfo.bankName}</p>` : ''}
                ${userInfo.bankAccountHolder ? `<p><strong>Account Holder:</strong> ${userInfo.bankAccountHolder}</p>` : ''}
                ${userInfo.bankAccountNumber ? `<p><strong>Account Number:</strong> ${userInfo.bankAccountNumber}</p>` : ''}
                ${userInfo.bankRoutingNumber ? `<p><strong>Routing Number:</strong> ${userInfo.bankRoutingNumber}</p>` : ''}
                ${userInfo.bankSwiftCode ? `<p><strong>SWIFT/BIC Code:</strong> ${userInfo.bankSwiftCode}</p>` : ''}
                ${userInfo.paymentInstructions ? `<p class="payment-notes">${userInfo.paymentInstructions}</p>` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Notes -->
          ${invoice.notes ? `
            <div class="notes-section">
              <h4>Notes</h4>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="margin-top: 8px;">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate PDF buffer from invoice
   */
  static async generateInvoicePDF(
    invoice: InvoiceWithDetails,
    userInfo: UserInfo
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // Generate HTML
      const html = this.generateInvoiceHTML(invoice, userInfo);
      
      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });
      
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}

