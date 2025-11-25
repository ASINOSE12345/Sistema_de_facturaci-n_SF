// ============================================================================
// FORMATTERS - Funciones de formateo centralizadas
// ============================================================================

import { Currency } from '../types';

/**
 * Formatea un número como moneda
 * @param amount - Monto a formatear
 * @param currency - Código de moneda (USD, EUR, ARS, MXN)
 * @param options - Opciones adicionales de formateo
 * @returns String formateado como moneda
 */
export const formatCurrency = (
  amount: number,
  currency: Currency,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  }
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  };

  // Determinar locale por moneda si no se especifica
  const locale = options?.locale ?? getLocaleForCurrency(currency);

  return new Intl.NumberFormat(locale, defaultOptions).format(amount);
};

/**
 * Obtiene el locale apropiado para una moneda
 */
function getLocaleForCurrency(currency: Currency): string {
  const localeMap: Record<Currency, string> = {
    USD: 'en-US',
    EUR: 'es-ES',
    ARS: 'es-AR',
    MXN: 'es-MX',
  };
  return localeMap[currency] || 'es-ES';
}

/**
 * Formatea una fecha
 * @param date - Fecha a formatear (Date object o string ISO)
 * @param format - Formato deseado (short, medium, long)
 * @param locale - Locale para el formateo
 * @returns String formateado
 */
export const formatDate = (
  date: Date | string,
  format: 'short' | 'long' | 'medium' = 'short',
  locale: string = 'es-ES'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }

  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
  };

  return new Intl.DateTimeFormat(locale, formatOptions[format]).format(dateObj);
};

/**
 * Formatea un porcentaje
 * @param value - Valor a formatear (ej: 21 para 21%)
 * @param decimals - Número de decimales
 * @returns String formateado con símbolo %
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea un número con separadores de miles
 * @param value - Número a formatear
 * @param decimals - Número de decimales
 * @param locale - Locale para el formateo
 * @returns String formateado
 */
export const formatNumber = (
  value: number,
  decimals: number = 0,
  locale: string = 'es-ES'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Calcula días entre dos fechas
 * @param startDate - Fecha inicial
 * @param endDate - Fecha final
 * @returns Número de días de diferencia
 */
export const calculateDaysBetween = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Calcula días de vencimiento (overdue)
 * @param dueDate - Fecha de vencimiento
 * @returns Días vencidos (positivo = vencido, negativo = por vencer)
 */
export const calculateDaysOverdue = (dueDate: Date | string): number => {
  const today = new Date();
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Trunca un texto agregando elipsis
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de un string
 * @param text - Texto a capitalizar
 * @returns Texto con primera letra mayúscula
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea un número de teléfono
 * @param phone - Número de teléfono
 * @returns Número formateado
 */
export const formatPhoneNumber = (phone: string): string => {
  // Implementación básica - puede mejorarse con librerías como libphonenumber-js
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

/**
 * Formatea un Tax ID según el país
 * @param taxId - Tax ID a formatear
 * @param country - Código de país
 * @returns Tax ID formateado
 */
export const formatTaxId = (taxId: string, country?: string): string => {
  if (!taxId) return '';
  
  // Ejemplos básicos - expandir según necesidad
  switch (country) {
    case 'USA':
      // EIN format: XX-XXXXXXX
      return taxId.replace(/(\d{2})(\d{7})/, '$1-$2');
    case 'ESP':
      // NIF/CIF español: AXXXXXXXX
      return taxId.toUpperCase();
    case 'ARG':
      // CUIT argentino: XX-XXXXXXXX-X
      return taxId.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3');
    default:
      return taxId;
  }
};


