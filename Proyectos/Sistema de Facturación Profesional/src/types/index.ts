// ============================================================================
// TIPOS PRINCIPALES DEL SISTEMA DE FACTURACIÓN
// ============================================================================

export type Currency = 'USD' | 'EUR' | 'ARS' | 'MXN';
export type Jurisdiction = 'USA' | 'ESP' | 'ARG';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'pending' | 'overdue' | 'cancelled';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';
export type Priority = 'low' | 'medium' | 'high';
export type Language = 'en' | 'es';
export type ClientStatus = 'active' | 'inactive';

// ============================================================================
// CLIENT
// ============================================================================

export interface Client {
  id: string;
  userId?: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  taxId: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  currency: Currency;
  taxRate: number;
  paymentTerms: number; // días
  status: ClientStatus;
  totalInvoiced: number;
  lastInvoice?: string;
  projects: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDTO {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  taxId: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  currency: Currency;
  taxRate?: number;
  paymentTerms?: number;
}

// ============================================================================
// INVOICE
// ============================================================================

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity?: number;
  hours?: number;
  rate?: number;
  unitPrice?: number;
  amount: number;
}

export interface TaxCalculation {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  jurisdiction: Jurisdiction;
  breakdown?: {
    stateTax?: number;
    countyTax?: number;
    cityTax?: number;
    ivaType?: string;
  };
}

export interface Invoice {
  id: string;
  userId?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  clientId: string;
  client?: Client;
  projectId?: string;
  project?: Project;
  jurisdiction: Jurisdiction;
  currency: Currency;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  paidDate?: Date;
  paymentMethod?: string;
  sentDate?: string;
  notes?: string;
  language: Language;
  pdfUrl?: string;
  
  // Campos específicos por jurisdicción
  isExportInvoice?: boolean;
  clientEmail?: string;
  clientAddress?: string;
  taxIdClient?: string;
  paymentTerms?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceDTO {
  clientId: string;
  projectId?: string;
  invoiceDate: Date | string;
  dueDate: Date | string;
  jurisdiction: Jurisdiction;
  currency: Currency;
  items: InvoiceItem[];
  taxRate?: number;
  discount?: number;
  notes?: string;
  language?: Language;
  paymentTerms?: number;
}

// ============================================================================
// PROJECT
// ============================================================================

export interface ProjectService {
  type: string;
  rate: number;
  hours: number;
}

export interface ProjectMilestone {
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
  budget: number;
}

export interface Project {
  id: string;
  userId?: string;
  name: string;
  description: string;
  clientId: string;
  client?: Client;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date;
  endDate: Date;
  budget: number;
  budgetSpent: number;
  currency: Currency;
  hoursEstimated: number;
  hoursLogged: number;
  progress: number;
  team: string[];
  services?: ProjectService[];
  milestones?: ProjectMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  clientId: string;
  status?: ProjectStatus;
  priority?: Priority;
  startDate: Date | string;
  endDate: Date | string;
  budget: number;
  currency: Currency;
  hoursEstimated: number;
}

// ============================================================================
// USER / AUTH
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  businessName?: string;
  taxId?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  businessName?: string;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// FILTERS
// ============================================================================

export interface InvoiceFilters {
  status?: InvoiceStatus;
  clientId?: string;
  jurisdiction?: Jurisdiction;
  currency?: Currency;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface ClientFilters {
  status?: ClientStatus;
  country?: string;
  currency?: Currency;
  search?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  clientId?: string;
  priority?: Priority;
  search?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale?: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'es-ES' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino', locale: 'es-AR' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano', locale: 'es-MX' }
];

export interface JurisdictionInfo {
  code: Jurisdiction;
  name: string;
  defaultTaxRate: number;
  currency: Currency;
}

export const JURISDICTIONS: JurisdictionInfo[] = [
  { code: 'USA', name: 'Estados Unidos', defaultTaxRate: 0, currency: 'USD' },
  { code: 'ESP', name: 'España', defaultTaxRate: 21, currency: 'EUR' },
  { code: 'ARG', name: 'Argentina', defaultTaxRate: 21, currency: 'ARS' }
];


