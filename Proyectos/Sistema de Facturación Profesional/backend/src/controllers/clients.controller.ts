// ============================================================================
// CLIENTS CONTROLLER - Client management with Prisma
// ============================================================================

import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const clientsController = {
  // GET /api/clients - Get all clients for authenticated user
  getAllClients: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const clients = await prisma.client.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json(clients);
    } catch (error) {
      console.error('Get all clients error:', error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  },

  // GET /api/clients/:id - Get client by ID
  getClientById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const client = await prisma.client.findFirst({
        where: {
          id,
          userId, // Ensure user owns this client
        },
        include: {
          projects: true,
          invoices: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      res.json(client);
    } catch (error) {
      console.error('Get client by ID error:', error);
      res.status(500).json({ error: 'Failed to fetch client' });
    }
  },

  // POST /api/clients - Create new client
  createClient: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const {
        businessName,
        contactName,
        email,
        phone,
        taxId,
        address,
        city,
        state,
        postalCode,
        country,
        currency,
        taxRate,
        paymentTerms,
      } = req.body;

      // Validate required fields
      if (!businessName || !contactName || !email || !taxId || !address) {
        res.status(400).json({
          error: 'Missing required fields: businessName, contactName, email, taxId, address',
        });
        return;
      }

      const client = await prisma.client.create({
        data: {
          userId,
          businessName,
          contactName,
          email,
          phone,
          taxId,
          address,
          city,
          state,
          postalCode,
          country: country || 'US',
          currency: currency || 'USD',
          taxRate: taxRate || 0,
          paymentTerms: paymentTerms || 30,
        },
      });

      res.status(201).json(client);
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({ error: 'Failed to create client' });
    }
  },

  // PUT /api/clients/:id - Update client
  updateClient: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check if client exists and belongs to user
      const existingClient = await prisma.client.findFirst({
        where: { id, userId },
      });

      if (!existingClient) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      const {
        businessName,
        contactName,
        email,
        phone,
        taxId,
        address,
        city,
        state,
        postalCode,
        country,
        currency,
        taxRate,
        paymentTerms,
        status,
      } = req.body;

      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          businessName,
          contactName,
          email,
          phone,
          taxId,
          address,
          city,
          state,
          postalCode,
          country,
          currency,
          taxRate,
          paymentTerms,
          status,
        },
      });

      res.json(updatedClient);
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({ error: 'Failed to update client' });
    }
  },

  // DELETE /api/clients/:id - Delete client
  deleteClient: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check if client exists and belongs to user
      const client = await prisma.client.findFirst({
        where: { id, userId },
      });

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      // Delete client (will cascade to related records)
      await prisma.client.delete({
        where: { id },
      });

      res.json({
        message: 'Client deleted successfully',
        id,
      });
    } catch (error) {
      console.error('Delete client error:', error);
      res.status(500).json({ error: 'Failed to delete client' });
    }
  },
};
