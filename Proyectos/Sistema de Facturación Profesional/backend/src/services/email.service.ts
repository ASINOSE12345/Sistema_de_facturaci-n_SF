// ============================================================================
// EMAIL SERVICE - Resend integration for invoice emails
// ============================================================================

import { Resend } from 'resend';
import { config } from '../config/env';

// Initialize Resend
let resendClient: Resend | null = null;
if (config.resendApiKey) {
  resendClient = new Resend(config.resendApiKey);
}

// Email queue (simple in-memory for MVP)
interface EmailQueueItem {
  id: string;
  type: 'invoice' | 'reminder' | 'confirmation';
  to: string;
  data: any;
  retries: number;
  createdAt: Date;
}

const emailQueue: EmailQueueItem[] = [];
const MAX_RETRIES = 3;

interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  total: string;
  dueDate: string;
  invoiceUrl: string;
  businessName: string;
  businessEmail: string;
  pdfBuffer?: Buffer;
  currency?: string;
  subtotal?: string;
  taxAmount?: string;
}

export class EmailService {
  /**
   * Generate invoice email HTML template
   */
  private static generateInvoiceEmailHTML(data: InvoiceEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${data.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }

          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: 700;
          }

          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.95;
          }

          .content {
            padding: 40px 30px;
          }

          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111;
            margin-bottom: 20px;
          }

          .message {
            font-size: 15px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.8;
          }

          .invoice-details {
            background: #f9fafb;
            border-left: 4px solid #2563eb;
            padding: 24px;
            margin: 30px 0;
            border-radius: 8px;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            font-size: 15px;
          }

          .detail-row:last-child {
            margin-bottom: 0;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 2px solid #e5e7eb;
            font-weight: 700;
            font-size: 20px;
            color: #1e40af;
          }

          .detail-label {
            color: #666;
            font-weight: 600;
          }

          .detail-value {
            color: #111;
            font-weight: 600;
          }

          .button-container {
            text-align: center;
            margin: 35px 0;
          }

          .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
          }

          .cta-button:hover {
            background: #1e40af;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(37, 99, 235, 0.4);
          }

          .note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 18px;
            margin: 25px 0;
            border-radius: 6px;
            font-size: 14px;
            color: #92400e;
            line-height: 1.6;
          }

          .note strong {
            display: block;
            margin-bottom: 8px;
            color: #78350f;
          }

          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
          }

          .footer p {
            margin: 8px 0;
          }

          .footer a {
            color: #2563eb;
            text-decoration: none;
          }

          .footer a:hover {
            text-decoration: underline;
          }

          .footer-logo {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>📄 New Invoice</h1>
            <p>Invoice #${data.invoiceNumber}</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">
              Hello ${data.clientName},
            </div>

            <div class="message">
              Thank you for your business! We've generated a new invoice for you.
              Please review the details below and process the payment at your earliest convenience.
            </div>

            <!-- Invoice Details -->
            <div class="invoice-details">
              <div class="detail-row">
                <span class="detail-label">Invoice Number:</span>
                <span class="detail-value">${data.invoiceNumber}</span>
              </div>
              ${data.subtotal ? `
              <div class="detail-row">
                <span class="detail-label">Subtotal:</span>
                <span class="detail-value">${data.subtotal}</span>
              </div>
              ` : ''}
              ${data.taxAmount ? `
              <div class="detail-row">
                <span class="detail-label">Tax:</span>
                <span class="detail-value">${data.taxAmount}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Due Date:</span>
                <span class="detail-value">${data.dueDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">${data.total}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="button-container">
              <a href="${data.invoiceUrl}" class="cta-button">
                📥 View & Download Invoice
              </a>
            </div>

            <!-- Payment Note -->
            <div class="note">
              <strong>💳 Payment Instructions</strong>
              Please make payment within the due date to avoid any late fees.
              If you have any questions about this invoice, please don't hesitate to contact us.
            </div>

            <div class="message" style="margin-top: 30px; color: #333;">
              We appreciate your prompt payment and continued business. Thank you!
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>${data.businessName}</strong></p>
            <p>
              <a href="mailto:${data.businessEmail}">${data.businessEmail}</a>
            </p>
            <div class="footer-logo">
              This is an automated email. Please do not reply directly to this message.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate payment reminder email HTML template
   */
  private static generateReminderEmailHTML(data: InvoiceEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder - Invoice ${data.invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #111; margin-bottom: 20px; }
          .message { font-size: 15px; color: #555; margin-bottom: 20px; line-height: 1.8; }
          .invoice-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 24px; margin: 25px 0; border-radius: 8px; }
          .invoice-box p { margin: 8px 0; font-size: 15px; }
          .invoice-box strong { color: #78350f; }
          .cta-button { display: inline-block; padding: 16px 40px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Payment Reminder</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${data.clientName},</div>
            <div class="message">
              This is a friendly reminder that invoice <strong>#${data.invoiceNumber}</strong> is due soon.
              We kindly request that you process the payment at your earliest convenience.
            </div>
            <div class="invoice-box">
              <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
              <p><strong>Amount Due:</strong> ${data.total}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.invoiceUrl}" class="cta-button">View Invoice</a>
            </div>
            <div class="message">
              If you have already made the payment, please disregard this reminder.
              For any questions, feel free to contact us.
            </div>
          </div>
          <div class="footer">
            <p><strong>${data.businessName}</strong></p>
            <p>${data.businessEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate payment confirmation email HTML template
   */
  private static generateConfirmationEmailHTML(data: InvoiceEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received - Invoice ${data.invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }
          .success-icon { font-size: 64px; text-align: center; margin: 30px 0; }
          .content { padding: 40px 30px; text-align: center; }
          .greeting { font-size: 18px; font-weight: 600; color: #111; margin-bottom: 20px; }
          .message { font-size: 15px; color: #555; margin-bottom: 20px; line-height: 1.8; }
          .payment-box { background: #d1fae5; border-left: 4px solid #059669; padding: 24px; margin: 25px 0; border-radius: 8px; }
          .payment-box p { margin: 8px 0; font-size: 15px; color: #065f46; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Received!</h1>
          </div>
          <div class="content">
            <div class="success-icon">🎉</div>
            <div class="greeting">Hello ${data.clientName},</div>
            <div class="message">
              Thank you! We've received your payment for invoice <strong>#${data.invoiceNumber}</strong>.
              Your account has been updated and this invoice is now marked as paid.
            </div>
            <div class="payment-box">
              <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
              <p><strong>Amount Paid:</strong> ${data.total}</p>
              <p><strong>Status:</strong> PAID</p>
            </div>
            <div class="message" style="margin-top: 30px;">
              We appreciate your prompt payment and look forward to continuing our business relationship.
            </div>
          </div>
          <div class="footer">
            <p><strong>${data.businessName}</strong></p>
            <p>${data.businessEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send invoice email with PDF attachment
   */
  static async sendInvoiceEmail(
    invoice: any,
    client: any,
    pdfBuffer?: Buffer
  ): Promise<void> {
    if (!resendClient) {
      console.warn('Resend API key not configured. Email not sent.');
      return;
    }

    const data: InvoiceEmailData = {
      invoiceNumber: invoice.invoiceNumber,
      clientName: client.contactName || client.businessName,
      clientEmail: client.email,
      total: `${invoice.currency} ${invoice.total.toFixed(2)}`,
      subtotal: `${invoice.currency} ${invoice.subtotal.toFixed(2)}`,
      taxAmount: `${invoice.currency} ${invoice.taxAmount.toFixed(2)}`,
      dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      invoiceUrl: `${config.frontendUrl}/invoices/${invoice.id}`,
      businessName: config.businessName || 'Your Business',
      businessEmail: config.fromEmail || 'invoices@yourbusiness.com',
      currency: invoice.currency,
    };

    const html = this.generateInvoiceEmailHTML(data);

    try {
      const emailData: any = {
        from: `${data.businessName} <${data.businessEmail}>`,
        to: data.clientEmail,
        subject: `Invoice ${data.invoiceNumber} from ${data.businessName}`,
        html: html,
      };

      // Add PDF attachment if provided
      if (pdfBuffer) {
        emailData.attachments = [
          {
            filename: `invoice-${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
          },
        ];
      }

      await resendClient.emails.send(emailData);
      console.log(`Invoice email sent successfully to ${data.clientEmail}`);
    } catch (error: any) {
      console.error('Error sending invoice email:', error);

      // Add to retry queue
      this.addToQueue('invoice', data.clientEmail, data, pdfBuffer);

      throw new Error(`Failed to send invoice email: ${error.message}`);
    }
  }

  /**
   * Send payment reminder email
   */
  static async sendPaymentReminderEmail(
    invoice: any,
    client: any
  ): Promise<void> {
    if (!resendClient) {
      console.warn('Resend API key not configured. Reminder email not sent.');
      return;
    }

    const data: InvoiceEmailData = {
      invoiceNumber: invoice.invoiceNumber,
      clientName: client.contactName || client.businessName,
      clientEmail: client.email,
      total: `${invoice.currency} ${invoice.total.toFixed(2)}`,
      dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      invoiceUrl: `${config.frontendUrl}/invoices/${invoice.id}`,
      businessName: config.businessName || 'Your Business',
      businessEmail: config.fromEmail || 'invoices@yourbusiness.com',
    };

    const html = this.generateReminderEmailHTML(data);

    try {
      await resendClient.emails.send({
        from: `${data.businessName} <${data.businessEmail}>`,
        to: data.clientEmail,
        subject: `Payment Reminder - Invoice ${data.invoiceNumber}`,
        html: html,
      });

      console.log(`Payment reminder sent to ${data.clientEmail}`);
    } catch (error: any) {
      console.error('Error sending payment reminder:', error);

      // Add to retry queue
      this.addToQueue('reminder', data.clientEmail, data);

      throw new Error(`Failed to send payment reminder: ${error.message}`);
    }
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmationEmail(
    invoice: any,
    client: any
  ): Promise<void> {
    if (!resendClient) {
      console.warn('Resend API key not configured. Confirmation email not sent.');
      return;
    }

    const data: InvoiceEmailData = {
      invoiceNumber: invoice.invoiceNumber,
      clientName: client.contactName || client.businessName,
      clientEmail: client.email,
      total: `${invoice.currency} ${invoice.total.toFixed(2)}`,
      dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US'),
      invoiceUrl: `${config.frontendUrl}/invoices/${invoice.id}`,
      businessName: config.businessName || 'Your Business',
      businessEmail: config.fromEmail || 'invoices@yourbusiness.com',
    };

    const html = this.generateConfirmationEmailHTML(data);

    try {
      await resendClient.emails.send({
        from: `${data.businessName} <${data.businessEmail}>`,
        to: data.clientEmail,
        subject: `Payment Received - Invoice ${data.invoiceNumber}`,
        html: html,
      });

      console.log(`Payment confirmation sent to ${data.clientEmail}`);
    } catch (error: any) {
      console.error('Error sending payment confirmation:', error);

      // Add to retry queue
      this.addToQueue('confirmation', data.clientEmail, data);

      throw new Error(`Failed to send payment confirmation: ${error.message}`);
    }
  }

  /**
   * Add email to retry queue
   */
  private static addToQueue(
    type: 'invoice' | 'reminder' | 'confirmation',
    to: string,
    data: any,
    pdfBuffer?: Buffer
  ): void {
    const queueItem: EmailQueueItem = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      to,
      data: { ...data, pdfBuffer },
      retries: 0,
      createdAt: new Date(),
    };

    emailQueue.push(queueItem);
    console.log(`Email added to retry queue: ${queueItem.id}`);
  }

  /**
   * Process email retry queue
   */
  static async processQueue(): Promise<void> {
    if (!resendClient || emailQueue.length === 0) {
      return;
    }

    console.log(`Processing email queue: ${emailQueue.length} items`);

    for (let i = emailQueue.length - 1; i >= 0; i--) {
      const item = emailQueue[i];

      if (item.retries >= MAX_RETRIES) {
        console.error(`Max retries reached for email ${item.id}. Removing from queue.`);
        emailQueue.splice(i, 1);
        continue;
      }

      try {
        // Retry sending based on type
        if (item.type === 'invoice') {
          await this.sendInvoiceEmail(
            { ...item.data, id: item.data.invoiceId },
            { email: item.to, contactName: item.data.clientName },
            item.data.pdfBuffer
          );
        } else if (item.type === 'reminder') {
          await this.sendPaymentReminderEmail(
            { ...item.data, id: item.data.invoiceId },
            { email: item.to, contactName: item.data.clientName }
          );
        } else if (item.type === 'confirmation') {
          await this.sendPaymentConfirmationEmail(
            { ...item.data, id: item.data.invoiceId },
            { email: item.to, contactName: item.data.clientName }
          );
        }

        // Remove from queue if successful
        emailQueue.splice(i, 1);
        console.log(`Email ${item.id} sent successfully after retry`);
      } catch (error) {
        item.retries++;
        console.error(`Retry ${item.retries} failed for email ${item.id}`);
      }
    }
  }

  /**
   * Get queue status
   */
  static getQueueStatus(): { count: number; items: EmailQueueItem[] } {
    return {
      count: emailQueue.length,
      items: emailQueue.map((item) => ({
        ...item,
        data: undefined, // Don't expose full data
      })),
    };
  }
}
