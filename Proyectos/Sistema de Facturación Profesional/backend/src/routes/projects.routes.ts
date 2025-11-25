// ============================================================================
// PROJECTS ROUTES - Project management endpoints
// ============================================================================

import { Router } from 'express';
import { projectsController } from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/projects - Get all projects for authenticated user
router.get('/', projectsController.getAllProjects);

// GET /api/projects/client/:clientId - Get projects by client ID
router.get('/client/:clientId', projectsController.getProjectsByClient);

// GET /api/projects/:id - Get project by ID
router.get('/:id', projectsController.getProjectById);

// POST /api/projects - Create new project
router.post('/', projectsController.createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', projectsController.updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', projectsController.deleteProject);

export default router;

