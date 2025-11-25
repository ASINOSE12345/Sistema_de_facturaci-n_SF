// ============================================================================
// CLIENTS ROUTES - Client management endpoints
// ============================================================================

import { Router } from 'express';
import { clientsController } from '../controllers/clients.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/clients - Get all clients for authenticated user
router.get('/', clientsController.getAllClients);

// GET /api/clients/:id - Get client by ID
router.get('/:id', clientsController.getClientById);

// POST /api/clients - Create new client
router.post('/', clientsController.createClient);

// PUT /api/clients/:id - Update client
router.put('/:id', clientsController.updateClient);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', clientsController.deleteClient);

export default router;
