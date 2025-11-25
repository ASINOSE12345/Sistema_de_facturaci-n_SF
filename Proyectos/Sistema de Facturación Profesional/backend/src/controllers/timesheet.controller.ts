// ============================================================================
// TIMESHEET CONTROLLER - Time entry management with Prisma
// ============================================================================

import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const timesheetController = {
  // GET /api/timesheet - Get all time entries for authenticated user
  getAllTimeEntries: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { projectId, status, startDate, endDate, isBillable } = req.query;

      const where: any = { userId };

      if (projectId) where.projectId = projectId as string;
      if (status) where.status = status as string;
      if (isBillable !== undefined) where.isBillable = isBillable === 'true';
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const timeEntries = await prisma.timeEntry.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              client: {
                select: {
                  id: true,
                  businessName: true,
                },
              },
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });

      // Transform time entries to match frontend format
      const transformedEntries = timeEntries.map((entry) => ({
        ...entry,
        tags: entry.tags ? JSON.parse(entry.tags) : [],
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        approvedAt: entry.approvedAt,
      }));

      res.json(transformedEntries);
    } catch (error) {
      console.error('Get all time entries error:', error);
      res.status(500).json({ error: 'Failed to fetch time entries' });
    }
  },

  // GET /api/timesheet/:id - Get time entry by ID
  getTimeEntryById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const timeEntry = await prisma.timeEntry.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          project: {
            include: {
              client: true,
            },
          },
          invoice: true,
        },
      });

      if (!timeEntry) {
        res.status(404).json({ error: 'Time entry not found' });
        return;
      }

      // Transform time entry
      const transformedEntry = {
        ...timeEntry,
        tags: timeEntry.tags ? JSON.parse(timeEntry.tags) : [],
      };

      res.json(transformedEntry);
    } catch (error) {
      console.error('Get time entry by ID error:', error);
      res.status(500).json({ error: 'Failed to fetch time entry' });
    }
  },

  // POST /api/timesheet - Create new time entry
  createTimeEntry: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const {
        projectId,
        invoiceId,
        taskName,
        description,
        date,
        startTime,
        endTime,
        hours,
        minutes,
        rate,
        currency,
        isBillable,
        tags,
      } = req.body;

      // Validate required fields
      if (!projectId || !description || !date || hours === undefined || rate === undefined) {
        res.status(400).json({
          error: 'Missing required fields: projectId, description, date, hours, rate',
        });
        return;
      }

      // Verify project belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      });

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Calculate total amount
      const totalHours = hours + (minutes || 0) / 60;
      const totalAmount = totalHours * rate;

      // Parse dates
      const parsedDate = new Date(date);
      const parsedStartTime = startTime ? new Date(startTime) : null;
      const parsedEndTime = endTime ? new Date(endTime) : null;

      // Create time entry
      const timeEntry = await prisma.timeEntry.create({
        data: {
          userId,
          projectId,
          invoiceId: invoiceId || null,
          taskName: taskName?.trim() || null,
          description: description.trim(),
          date: parsedDate,
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          hours: parseFloat(hours) || 0,
          minutes: parseInt(minutes) || 0,
          rate: parseFloat(rate),
          currency: currency || 'USD',
          isBillable: isBillable !== undefined ? Boolean(isBillable) : true,
          status: 'PENDING',
          totalAmount,
          tags: tags ? JSON.stringify(Array.isArray(tags) ? tags : []) : '[]',
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              client: {
                select: {
                  id: true,
                  businessName: true,
                },
              },
            },
          },
        },
      });

      // Update project hours logged
      await prisma.project.update({
        where: { id: projectId },
        data: {
          hoursLogged: {
            increment: Math.round(totalHours),
          },
        },
      });

      // Transform time entry
      const transformedEntry = {
        ...timeEntry,
        tags: timeEntry.tags ? JSON.parse(timeEntry.tags) : [],
      };

      res.status(201).json(transformedEntry);
    } catch (error: any) {
      console.error('Create time entry error:', error);
      res.status(500).json({ 
        error: 'Failed to create time entry',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  },

  // PUT /api/timesheet/:id - Update time entry
  updateTimeEntry: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check if time entry exists and belongs to user
      const existingEntry = await prisma.timeEntry.findFirst({
        where: { id, userId },
      });

      if (!existingEntry) {
        res.status(404).json({ error: 'Time entry not found' });
        return;
      }

      // Only allow updating PENDING entries
      if (existingEntry.status !== 'PENDING') {
        res.status(400).json({
          error: 'Cannot update time entry',
          message: 'Only PENDING time entries can be updated',
        });
        return;
      }

      const {
        taskName,
        description,
        date,
        startTime,
        endTime,
        hours,
        minutes,
        rate,
        currency,
        isBillable,
        tags,
      } = req.body;

      // Prepare update data
      const updateData: any = {};

      if (description !== undefined) updateData.description = description.trim();
      if (taskName !== undefined) updateData.taskName = taskName?.trim() || null;
      if (date !== undefined) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          res.status(400).json({ error: 'Invalid date format' });
          return;
        }
        updateData.date = parsedDate;
      }
      if (startTime !== undefined) updateData.startTime = startTime ? new Date(startTime) : null;
      if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
      if (hours !== undefined) updateData.hours = parseFloat(hours);
      if (minutes !== undefined) updateData.minutes = parseInt(minutes);
      if (rate !== undefined) updateData.rate = parseFloat(rate);
      if (currency !== undefined) updateData.currency = currency;
      if (isBillable !== undefined) updateData.isBillable = Boolean(isBillable);
      if (tags !== undefined) {
        updateData.tags = JSON.stringify(Array.isArray(tags) ? tags : []);
      }

      // Recalculate total amount if hours or rate changed
      if (updateData.hours !== undefined || updateData.minutes !== undefined || updateData.rate !== undefined) {
        const finalHours = updateData.hours !== undefined ? updateData.hours : existingEntry.hours;
        const finalMinutes = updateData.minutes !== undefined ? updateData.minutes : existingEntry.minutes;
        const finalRate = updateData.rate !== undefined ? updateData.rate : existingEntry.rate;
        const totalHours = finalHours + (finalMinutes / 60);
        updateData.totalAmount = totalHours * finalRate;
      }

      const updatedEntry = await prisma.timeEntry.update({
        where: { id },
        data: updateData,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Transform time entry
      const transformedEntry = {
        ...updatedEntry,
        tags: updatedEntry.tags ? JSON.parse(updatedEntry.tags) : [],
      };

      res.json(transformedEntry);
    } catch (error) {
      console.error('Update time entry error:', error);
      res.status(500).json({ error: 'Failed to update time entry' });
    }
  },

  // PUT /api/timesheet/:id/approve - Approve time entry
  approveTimeEntry: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const timeEntry = await prisma.timeEntry.findFirst({
        where: { id, userId },
      });

      if (!timeEntry) {
        res.status(404).json({ error: 'Time entry not found' });
        return;
      }

      if (timeEntry.status !== 'PENDING') {
        res.status(400).json({
          error: 'Cannot approve time entry',
          message: `Time entry is already ${timeEntry.status}`,
        });
        return;
      }

      const updatedEntry = await prisma.timeEntry.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: userId,
          approvedAt: new Date(),
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Transform time entry
      const transformedEntry = {
        ...updatedEntry,
        tags: updatedEntry.tags ? JSON.parse(updatedEntry.tags) : [],
      };

      res.json(transformedEntry);
    } catch (error) {
      console.error('Approve time entry error:', error);
      res.status(500).json({ error: 'Failed to approve time entry' });
    }
  },

  // PUT /api/timesheet/:id/reject - Reject time entry
  rejectTimeEntry: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const { reason } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const timeEntry = await prisma.timeEntry.findFirst({
        where: { id, userId },
      });

      if (!timeEntry) {
        res.status(404).json({ error: 'Time entry not found' });
        return;
      }

      if (timeEntry.status !== 'PENDING') {
        res.status(400).json({
          error: 'Cannot reject time entry',
          message: `Time entry is already ${timeEntry.status}`,
        });
        return;
      }

      const updatedEntry = await prisma.timeEntry.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectedReason: reason || 'Rejected by user',
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Transform time entry
      const transformedEntry = {
        ...updatedEntry,
        tags: updatedEntry.tags ? JSON.parse(updatedEntry.tags) : [],
      };

      res.json(transformedEntry);
    } catch (error) {
      console.error('Reject time entry error:', error);
      res.status(500).json({ error: 'Failed to reject time entry' });
    }
  },

  // DELETE /api/timesheet/:id - Delete time entry
  deleteTimeEntry: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check if time entry exists and belongs to user
      const timeEntry = await prisma.timeEntry.findFirst({
        where: { id, userId },
      });

      if (!timeEntry) {
        res.status(404).json({ error: 'Time entry not found' });
        return;
      }

      // Only allow deleting PENDING entries
      if (timeEntry.status !== 'PENDING') {
        res.status(400).json({
          error: 'Cannot delete time entry',
          message: 'Only PENDING time entries can be deleted',
        });
        return;
      }

      // Update project hours logged
      const totalHours = timeEntry.hours + (timeEntry.minutes / 60);
      await prisma.project.update({
        where: { id: timeEntry.projectId },
        data: {
          hoursLogged: {
            decrement: Math.round(totalHours),
          },
        },
      });

      // Delete time entry
      await prisma.timeEntry.delete({
        where: { id },
      });

      res.json({
        message: 'Time entry deleted successfully',
        id,
      });
    } catch (error) {
      console.error('Delete time entry error:', error);
      res.status(500).json({ error: 'Failed to delete time entry' });
    }
  },
};

