// ============================================================================
// CONSTANTS - Constantes del sistema
// ============================================================================

import { Currency, Jurisdiction, CurrencyInfo, JurisdictionInfo } from '../types';

// ============================================================================
// CURRENCIES
// ============================================================================

export const CURRENCIES: CurrencyInfo[] = [
  { 
    code: 'USD', 
    symbol: '$', 
    name: 'Dólar Estadounidense',
    locale: 'en-US'
  },
  { 
    code: 'EUR', 
    symbol: '€', 
    name: 'Euro',
    locale: 'es-ES'
  },
  { 
    code: 'ARS', 
    symbol: '$', 
    name: 'Peso Argentino',
    locale: 'es-AR'
  },
  { 
    code: 'MXN', 
    symbol: '$', 
    name: 'Peso Mexicano',
    locale: 'es-MX'
  }
];

export const getCurrencyInfo = (code: Currency): CurrencyInfo | undefined => {
  return CURRENCIES.find(c => c.code === code);
};

// ============================================================================
// JURISDICTIONS
// ============================================================================

export const JURISDICTIONS: JurisdictionInfo[] = [
  { 
    code: 'USA', 
    name: 'Estados Unidos',
    defaultTaxRate: 0, // Sales tax varía por estado
    currency: 'USD'
  },
  { 
    code: 'ESP', 
    name: 'España',
    defaultTaxRate: 21, // IVA general
    currency: 'EUR'
  },
  { 
    code: 'ARG', 
    name: 'Argentina',
    defaultTaxRate: 21, // IVA general
    currency: 'ARS'
  }
];

export const getJurisdictionInfo = (code: Jurisdiction): JurisdictionInfo | undefined => {
  return JURISDICTIONS.find(j => j.code === code);
};

// ============================================================================
// PAYMENT TERMS
// ============================================================================

export const PAYMENT_TERMS = [
  { value: 0, label: 'Inmediato' },
  { value: 7, label: '7 días' },
  { value: 15, label: '15 días' },
  { value: 30, label: '30 días' },
  { value: 45, label: '45 días' },
  { value: 60, label: '60 días' },
  { value: 90, label: '90 días' }
];

// ============================================================================
// STATUS TRANSLATIONS
// ============================================================================

export const INVOICE_STATUS_LABELS = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  pending: 'Pendiente',
  overdue: 'Vencida',
  cancelled: 'Cancelada'
};

export const PROJECT_STATUS_LABELS = {
  planning: 'Planificación',
  in_progress: 'En Progreso',
  on_hold: 'En Pausa',
  completed: 'Completado'
};

export const PRIORITY_LABELS = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
};

export const CLIENT_STATUS_LABELS = {
  active: 'Activo',
  inactive: 'Inactivo'
};

// ============================================================================
// TAX RATES BY JURISDICTION
// ============================================================================

export const TAX_RATES = {
  USA: {
    federal: 0,
    states: {
      WY: { state: 4, average_local: 1.36 },
      CA: { state: 7.25, average_local: 2.5 },
      TX: { state: 6.25, average_local: 1.94 },
      FL: { state: 6, average_local: 1.05 },
      NY: { state: 4, average_local: 4.49 },
      // Agregar más según necesidad
    }
  },
  ESP: {
    general: 21,
    reducido: 10,
    superreducido: 4
  },
  ARG: {
    general: 21,
    reducido: 10.5,
    exento: 0
  }
};

// ============================================================================
// COUNTRIES
// ============================================================================

export const COUNTRIES = [
  { code: 'US', name: 'Estados Unidos', jurisdiction: 'USA' as Jurisdiction },
  { code: 'ES', name: 'España', jurisdiction: 'ESP' as Jurisdiction },
  { code: 'AR', name: 'Argentina', jurisdiction: 'ARG' as Jurisdiction },
  { code: 'MX', name: 'México', jurisdiction: 'USA' as Jurisdiction }, // Inicialmente bajo USA
  { code: 'CO', name: 'Colombia', jurisdiction: 'USA' as Jurisdiction },
  { code: 'CL', name: 'Chile', jurisdiction: 'USA' as Jurisdiction },
  { code: 'PE', name: 'Perú', jurisdiction: 'USA' as Jurisdiction },
  { code: 'UY', name: 'Uruguay', jurisdiction: 'USA' as Jurisdiction },
];

// ============================================================================
// US STATES
// ============================================================================

export const US_STATES = [
  { code: 'WY', name: 'Wyoming' },
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  },
  clients: '/clients',
  projects: '/projects',
  invoices: '/invoices',
  reports: '/reports',
  settings: '/settings'
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    message: 'Teléfono inválido'
  },
  taxId: {
    minLength: 5,
    maxLength: 20,
    message: 'Tax ID debe tener entre 5 y 20 caracteres'
  },
  invoiceNumber: {
    pattern: /^[A-Z0-9\-]+$/i,
    message: 'Número de factura inválido'
  }
};


