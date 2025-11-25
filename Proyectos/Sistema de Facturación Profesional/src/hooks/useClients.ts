// ============================================================================
// USE CLIENTS HOOK - Client management
// ============================================================================

import { useState, useEffect } from 'react';
import { clientsAPI } from '../lib/api';
import type { Client, CreateClientDTO } from '../types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch clients';
      setError(message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single client by ID
  const fetchClientById = async (id: string): Promise<Client | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await clientsAPI.getById(id);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch client';
      setError(message);
      console.error('Error fetching client:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new client
  const createClient = async (data: CreateClientDTO): Promise<Client | null> => {
    try {
      setLoading(true);
      setError(null);

      const newClient = await clientsAPI.create(data);
      
      setClients(prev => [newClient, ...prev]);
      
      return newClient;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create client';
      setError(message);
      console.error('Error creating client:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update client
  const updateClient = async (id: string, data: Partial<Client>): Promise<Client | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedClient = await clientsAPI.update(id, data);
      
      setClients(prev => 
        prev.map(client => client.id === id ? updatedClient : client)
      );
      
      return updatedClient;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update client';
      setError(message);
      console.error('Error updating client:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete client
  const deleteClient = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await clientsAPI.delete(id);
      
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete client';
      setError(message);
      console.error('Error deleting client:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
  };
}

