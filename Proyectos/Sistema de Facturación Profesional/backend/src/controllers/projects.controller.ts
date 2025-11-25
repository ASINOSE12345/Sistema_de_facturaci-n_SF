// ============================================================================
// PROJECTS CONTROLLER - Project management with Prisma
// ============================================================================

import { Request, Response } from 'express';
import { prisma } from '../config/database';

// Map frontend status to Prisma status
const mapStatusToPrisma = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'IN_PROGRESS',
    'in_progress': 'IN_PROGRESS',
    'planning': 'PLANNING',
    'on_hold': 'ON_HOLD',
    'completed': 'COMPLETED',
  };
  return statusMap[status.toLowerCase()] || 'PLANNING';
};

// Map Prisma status to frontend status
const mapStatusFromPrisma = (status: string): string => {
  const statusMap: Record<string, string> = {
    'IN_PROGRESS': 'active',
    'PLANNING': 'planning',
    'ON_HOLD': 'on_hold',
    'COMPLETED': 'completed',
  };
  return statusMap[status] || 'planning';
};

// Map priority to uppercase
const mapPriority = (priority: string): string => {
  return priority.toUpperCase();
};

export const projectsController = {
  // GET /api/projects - Get all projects for authenticated user
  getAllProjects: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const projects = await prisma.project.findMany({
        where: { userId },
        include: {
          client: {
            select: {
              id: true,
              businessName: true,
              contactName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform projects to match frontend format
      const transformedProjects = projects.map((project) => ({
        ...project,
        status: mapStatusFromPrisma(project.status),
        priority: project.priority.toLowerCase(),
        team: project.team ? JSON.parse(project.team) : [],
        services: project.services ? JSON.parse(project.services) : [],
        milestones: project.milestones ? JSON.parse(project.milestones) : [],
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }));

      res.json(transformedProjects);
    } catch (error) {
      console.error('Get all projects error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  // GET /api/projects/:id - Get project by ID
  getProjectById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const project = await prisma.project.findFirst({
        where: {
          id,
          userId, // Ensure user owns this project
        },
        include: {
          client: true,
          invoices: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Transform project to match frontend format
      const transformedProject = {
        ...project,
        status: mapStatusFromPrisma(project.status),
        priority: project.priority.toLowerCase(),
        team: project.team ? JSON.parse(project.team) : [],
        services: project.services ? JSON.parse(project.services) : [],
        milestones: project.milestones ? JSON.parse(project.milestones) : [],
      };

      res.json(transformedProject);
    } catch (error) {
      console.error('Get project by ID error:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  },

  // GET /api/projects/client/:clientId - Get projects by client ID
  getProjectsByClient: async (req: Request, res: Response) => {
    try {
      const { clientId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Verify client belongs to user
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      const projects = await prisma.project.findMany({
        where: {
          clientId,
          userId,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform projects to match frontend format
      const transformedProjects = projects.map((project) => ({
        ...project,
        status: mapStatusFromPrisma(project.status),
        priority: project.priority.toLowerCase(),
        team: project.team ? JSON.parse(project.team) : [],
        services: project.services ? JSON.parse(project.services) : [],
        milestones: project.milestones ? JSON.parse(project.milestones) : [],
      }));

      res.json(transformedProjects);
    } catch (error) {
      console.error('Get projects by client error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  // POST /api/projects - Create new project
  createProject: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const {
        clientId,
        name,
        description,
        status,
        priority,
        startDate,
        endDate,
        budget,
        currency,
        hoursEstimated,
        team,
        services,
        milestones,
      } = req.body;

      // Validate required fields
      if (!clientId || !name || !description || !startDate || !endDate || budget === undefined) {
        res.status(400).json({
          error: 'Missing required fields: clientId, name, description, startDate, endDate, budget',
        });
        return;
      }

      // Verify client belongs to user
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      // Parse dates
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      // Validate dates
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }

      if (parsedEndDate < parsedStartDate) {
        res.status(400).json({ error: 'End date must be after start date' });
        return;
      }

      // Create project
      const project = await prisma.project.create({
        data: {
          userId,
          clientId,
          name: name.trim(),
          description: description.trim(),
          status: mapStatusToPrisma(status || 'planning'),
          priority: mapPriority(priority || 'medium'),
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          budget: parseFloat(budget) || 0,
          budgetSpent: 0,
          currency: currency || 'USD',
          hoursEstimated: parseInt(hoursEstimated) || 0,
          hoursLogged: 0,
          progress: 0,
          team: team ? JSON.stringify(Array.isArray(team) ? team : []) : '[]',
          services: services ? JSON.stringify(Array.isArray(services) ? services : []) : '[]',
          milestones: milestones ? JSON.stringify(Array.isArray(milestones) ? milestones : []) : '[]',
        },
        include: {
          client: {
            select: {
              id: true,
              businessName: true,
              contactName: true,
              email: true,
            },
          },
        },
      });

      // Transform project to match frontend format
      const transformedProject = {
        ...project,
        status: mapStatusFromPrisma(project.status),
        priority: project.priority.toLowerCase(),
        team: project.team ? JSON.parse(project.team) : [],
        services: project.services ? JSON.parse(project.services) : [],
        milestones: project.milestones ? JSON.parse(project.milestones) : [],
      };

      res.status(201).json(transformedProject);
    } catch (error: any) {
      console.error('Create project error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
      });
      res.status(500).json({ 
        error: 'Failed to create project',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  },

  // PUT /api/projects/:id - Update project
  updateProject: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check if project exists and belongs to user
      const existingProject = await prisma.project.findFirst({
        where: { id, userId },
      });

      if (!existingProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const {
        name,
        description,
        status,
        priority,
        startDate,
        endDate,
        budget,
        budgetSpent,
        currency,
        hoursEstimated,
        hoursLogged,
        progress,
        team,
        services,
        milestones,
      } = req.body;

      // Prepare update data
      const updateData: any = {};

      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (status !== undefined) updateData.status = mapStatusToPrisma(status);
      if (priority !== undefined) updateData.priority = mapPriority(priority);
      if (startDate !== undefined) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
          res.status(400).json({ error: 'Invalid start date format' });
          return;
        }
        updateData.startDate = parsedStartDate;
      }
      if (endDate !== undefined) {
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate.getTime())) {
          res.status(400).json({ error: 'Invalid end date format' });
          return;
        }
        updateData.endDate = parsedEndDate;
      }
      if (budget !== undefined) updateData.budget = parseFloat(budget);
      if (budgetSpent !== undefined) updateData.budgetSpent = parseFloat(budgetSpent);
      if (currency !== undefined) updateData.currency = currency;
      if (hoursEstimated !== undefined) updateData.hoursEstimated = parseInt(hoursEstimated);
      if (hoursLogged !== undefined) updateData.hoursLogged = parseInt(hoursLogged);
      if (progress !== undefined) updateData.progress = parseInt(progress);
      if (team !== undefined) {
        updateData.team = JSON.stringify(Array.isArray(team) ? team : []);
      }
      if (services !== undefined) {
        updateData.services = JSON.stringify(Array.isArray(services) ? services : []);
      }
      if (milestones !== undefined) {
        updateData.milestones = JSON.stringify(Array.isArray(milestones) ? milestones : []);
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data: updateData,
        include: {
          client: {
            select: {
              id: true,
              businessName: true,
              contactName: true,
              email: true,
            },
          },
        },
      });

      // Transform project to match frontend format
      const transformedProject = {
        ...updatedProject,
        status: mapStatusFromPrisma(updatedProject.status),
        priority: updatedProject.priority.toLowerCase(),
        team: updatedProject.team ? JSON.parse(updatedProject.team) : [],
        services: updatedProject.services ? JSON.parse(updatedProject.services) : [],
        milestones: updatedProject.milestones ? JSON.parse(updatedProject.milestones) : [],
      };

      res.json(transformedProject);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  },

  // DELETE /api/projects/:id - Delete project
  deleteProject: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check if project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: { id, userId },
        include: {
          invoices: {
            take: 1,
          },
        },
      });

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Check if project has invoices
      if (project.invoices.length > 0) {
        res.status(400).json({
          error: 'Cannot delete project',
          message: 'Project has associated invoices. Please delete or unlink invoices first.',
        });
        return;
      }

      // Delete project (will cascade to related records)
      await prisma.project.delete({
        where: { id },
      });

      res.json({
        message: 'Project deleted successfully',
        id,
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  },
};

