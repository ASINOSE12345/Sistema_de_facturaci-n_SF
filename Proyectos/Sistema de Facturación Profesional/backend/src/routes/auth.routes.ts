// ============================================================================
// AUTH ROUTES - Authentication endpoints
// ============================================================================

import { Router } from 'express';
import { register, login, getCurrentUser, updateCurrentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateCurrentUser);

export default router;
