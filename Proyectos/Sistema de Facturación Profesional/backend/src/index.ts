// ============================================================================
// MAIN SERVER - Sistema de Facturación Wyoming MVP
// ============================================================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { prisma } from './config/database';
import { InvoiceStatusJob } from './jobs/invoice-status.job';

// Import routes
import clientsRouter from './routes/clients.routes';
import invoicesRouter from './routes/invoices.routes';
import authRouter from './routes/auth.routes';
import settingsRouter from './routes/settings.routes';
import projectsRouter from './routes/projects.routes';
import timesheetRouter from './routes/timesheet.routes';

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/timesheet', timesheetRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// ============================================================================
// SERVER START
// ============================================================================

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start invoice status cron job
    InvoiceStatusJob.start();
    console.log('✅ Invoice status cron job started');

    // Start server
    app.listen(config.port, () => {
      console.log('');
      console.log('🚀 Wyoming Invoice System - Backend API');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📡 Server running on: http://localhost:${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`🎯 Frontend URL: ${config.frontendUrl}`);
      console.log(`⏰ Cron Jobs: Invoice status check (daily at 9:00 AM)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  InvoiceStatusJob.stop();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  InvoiceStatusJob.stop();
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
