// ============================================================================
// INVOICE STATUS CRON JOB - Automatic status updates and reminders
// ============================================================================

import * as cron from 'node-cron';
import { prisma } from '../config/database';
import { EmailService } from '../services/email.service';

/**
 * Job execution statistics
 */
interface JobStats {
  lastRun: Date | null;
  totalRuns: number;
  invoicesProcessed: number;
  remindersSet: number;
  overdueMarked: number;
  errors: number;
}

// Job statistics
const jobStats: JobStats = {
  lastRun: null,
  totalRuns: 0,
  invoicesProcessed: 0,
  remindersSet: 0,
  overdueMarked: 0,
  errors: 0,
};

/**
 * Invoice Status Job Service
 * Handles automatic invoice status updates and payment reminders
 */
export class InvoiceStatusJob {
  private static isRunning = false;
  private static cronTask: cron.ScheduledTask | null = null;

  /**
   * Start the cron job
   * Runs daily at 9:00 AM
   */
  static start(): void {
    if (this.cronTask) {
      console.log('Invoice status job is already running');
      return;
    }

    // Schedule: Every day at 9:00 AM
    // Format: second minute hour day month weekday
    this.cronTask = cron.schedule('0 9 * * *', async () => {
      await this.execute();
    });

    console.log('Invoice status cron job started (runs daily at 9:00 AM)');

    // Run immediately on start (optional, for testing)
    // this.execute();
  }

  /**
   * Stop the cron job
   */
  static stop(): void {
    if (this.cronTask) {
      this.cronTask.stop();
      this.cronTask = null;
      console.log('Invoice status cron job stopped');
    }
  }

  /**
   * Execute the job manually
   */
  static async execute(): Promise<void> {
    if (this.isRunning) {
      console.log('Invoice status job is already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting invoice status job...');

    try {
      jobStats.totalRuns++;
      jobStats.lastRun = new Date();

      // 1. Mark overdue invoices
      await this.markOverdueInvoices();

      // 2. Send payment reminders
      await this.sendPaymentReminders();

      // 3. Process email retry queue
      await EmailService.processQueue();

      // 4. Clean expired cache entries
      // await CurrencyService.cleanExpiredCache(); // Uncomment if needed

      console.log('Invoice status job completed successfully');
      console.log('Job Stats:', {
        invoicesProcessed: jobStats.invoicesProcessed,
        remindersSet: jobStats.remindersSet,
        overdueMarked: jobStats.overdueMarked,
      });
    } catch (error: any) {
      jobStats.errors++;
      console.error('Invoice status job failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Mark invoices as overdue if past due date
   */
  private static async markOverdueInvoices(): Promise<void> {
    try {
      const now = new Date();

      // Find all SENT invoices that are past due date
      const overdueInvoices = await prisma.invoice.findMany({
        where: {
          status: 'SENT',
          dueDate: {
            lt: now,
          },
        },
        include: {
          client: true,
        },
      });

      console.log(`Found ${overdueInvoices.length} overdue invoices`);

      // Update status to OVERDUE
      for (const invoice of overdueInvoices) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'OVERDUE' },
        });

        jobStats.overdueMarked++;
        jobStats.invoicesProcessed++;

        console.log(`Marked invoice ${invoice.invoiceNumber} as OVERDUE`);

        // Send overdue notification
        try {
          await EmailService.sendPaymentReminderEmail(invoice, invoice.client);
        } catch (emailError) {
          console.error(`Failed to send overdue notification for ${invoice.invoiceNumber}:`, emailError);
        }
      }
    } catch (error) {
      console.error('Failed to mark overdue invoices:', error);
      throw error;
    }
  }

  /**
   * Send payment reminders for invoices due soon (7 days before due date)
   */
  private static async sendPaymentReminders(): Promise<void> {
    try {
      const now = new Date();
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 7); // 7 days from now

      // Find SENT invoices due within 7 days
      const upcomingInvoices = await prisma.invoice.findMany({
        where: {
          status: 'SENT',
          dueDate: {
            gte: now,
            lte: reminderDate,
          },
        },
        include: {
          client: true,
        },
      });

      console.log(`Found ${upcomingInvoices.length} invoices due within 7 days`);

      // Send reminder emails
      for (const invoice of upcomingInvoices) {
        try {
          await EmailService.sendPaymentReminderEmail(invoice, invoice.client);
          jobStats.remindersSet++;
          jobStats.invoicesProcessed++;

          console.log(`Sent payment reminder for invoice ${invoice.invoiceNumber}`);
        } catch (emailError) {
          console.error(`Failed to send reminder for ${invoice.invoiceNumber}:`, emailError);
        }
      }
    } catch (error) {
      console.error('Failed to send payment reminders:', error);
      throw error;
    }
  }

  /**
   * Get job statistics
   */
  static getStats(): JobStats {
    return { ...jobStats };
  }

  /**
   * Reset job statistics
   */
  static resetStats(): void {
    jobStats.lastRun = null;
    jobStats.totalRuns = 0;
    jobStats.invoicesProcessed = 0;
    jobStats.remindersSet = 0;
    jobStats.overdueMarked = 0;
    jobStats.errors = 0;
    console.log('Job statistics reset');
  }

  /**
   * Check if job is currently running
   */
  static isJobRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get next scheduled run time
   */
  static getNextRun(): string | null {
    if (!this.cronTask) {
      return null;
    }

    // Get next occurrence
    const now = new Date();
    const nextRun = new Date(now);

    // Set to 9:00 AM
    nextRun.setHours(9, 0, 0, 0);

    // If already past 9:00 AM today, set to tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    return nextRun.toISOString();
  }

  /**
   * Force check and update a specific invoice
   */
  static async checkInvoice(invoiceId: string): Promise<{
    updated: boolean;
    previousStatus: string;
    currentStatus: string;
    action: string;
  }> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const now = new Date();
    const previousStatus = invoice.status;
    let action = 'No action needed';
    let updated = false;

    // Check if should be marked as overdue
    if (invoice.status === 'SENT' && invoice.dueDate < now) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'OVERDUE' },
      });

      action = 'Marked as OVERDUE';
      updated = true;

      // Send notification
      try {
        await EmailService.sendPaymentReminderEmail(invoice, invoice.client);
        action += ' and sent reminder email';
      } catch (error) {
        console.error('Failed to send reminder email:', error);
      }
    }

    // Check if reminder should be sent
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 7);

    if (invoice.status === 'SENT' && invoice.dueDate <= reminderDate && invoice.dueDate >= now) {
      try {
        await EmailService.sendPaymentReminderEmail(invoice, invoice.client);
        action = action === 'No action needed' ? 'Sent payment reminder' : action + ' and sent payment reminder';
      } catch (error) {
        console.error('Failed to send reminder email:', error);
      }
    }

    return {
      updated,
      previousStatus,
      currentStatus: updated ? 'OVERDUE' : previousStatus,
      action,
    };
  }
}

// Auto-start the job when module is loaded (optional)
// InvoiceStatusJob.start();
