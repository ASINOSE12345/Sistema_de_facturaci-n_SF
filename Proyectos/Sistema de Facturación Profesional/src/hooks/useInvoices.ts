// ============================================================================
// USE INVOICES HOOK - Invoice data management
// ============================================================================

import { useState, useEffect } from 'react';
import { invoicesAPI } from '../lib/api';
import type { Invoice } from '../types';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeInvoice = (invoice: any) => ({
    ...invoice,
    status: invoice.status?.toLowerCase(),
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoicesAPI.getAll();
      setInvoices(data.map(normalizeInvoice));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch invoices');
      console.error('Fetch invoices error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const createInvoice = async (invoiceData: any) => {
    try {
      const newInvoice = await invoicesAPI.create(invoiceData);
      const normalized = normalizeInvoice(newInvoice);
      setInvoices((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create invoice';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateInvoice = async (id: string, invoiceData: any) => {
    try {
      const updatedInvoice = await invoicesAPI.update(id, invoiceData);
      const normalized = normalizeInvoice(updatedInvoice);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? normalized : inv))
      );
      return normalized;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update invoice';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await invoicesAPI.delete(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to delete invoice';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const sendInvoice = async (id: string) => {
    try {
      const updatedInvoice = await invoicesAPI.send(id);
      const normalized = normalizeInvoice(updatedInvoice);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? normalized : inv))
      );
      return normalized;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to send invoice';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const updatedInvoice = await invoicesAPI.markAsPaid(id);
      const normalized = normalizeInvoice(updatedInvoice);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? normalized : inv))
      );
      return normalized;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to mark invoice as paid';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    markAsPaid,
  };
};
