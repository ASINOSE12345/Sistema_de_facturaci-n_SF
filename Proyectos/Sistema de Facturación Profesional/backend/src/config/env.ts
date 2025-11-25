// ============================================================================
// ENVIRONMENT CONFIG - Variables de entorno
// ============================================================================

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '4001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4000',

  // Email (Resend)
  resendApiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.FROM_EMAIL || 'invoices@yourdomain.com',
  businessName: process.env.BUSINESS_NAME || 'Your Business',

  // Currency Exchange API
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY || '',
  exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6',

  // Legacy SendGrid (deprecated)
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
} as const;

// Validar configuración crítica en TODOS los entornos
const errors: string[] = [];

if (!config.databaseUrl) {
  errors.push('DATABASE_URL must be defined');
}

if (!config.jwtSecret || config.jwtSecret === 'default-secret-change-this') {
  errors.push('JWT_SECRET must be defined and secure');
}

if (config.jwtSecret.length < 32) {
  errors.push('JWT_SECRET must be at least 32 characters long');
}

if (config.nodeEnv === 'production') {
  if (config.jwtSecret.includes('secret') || config.jwtSecret.includes('change')) {
    errors.push('JWT_SECRET appears to be a placeholder - use a secure random value');
  }
}

if (errors.length > 0) {
  console.error('❌ Environment configuration errors:');
  errors.forEach((error) => console.error(`   - ${error}`));
  throw new Error('Invalid environment configuration');
}

export default config;






