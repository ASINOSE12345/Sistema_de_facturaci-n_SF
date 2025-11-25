// ============================================================================
// TIMESHEET ROUTES - Time entry management endpoints
// ============================================================================

import { Router } from 'express';
import { timesheetController } from '../controllers/timesheet.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/timesheet - Get all time entries for authenticated user
router.get('/', timesheetController.getAllTimeEntries);

// GET /api/timesheet/:id - Get time entry by ID
router.get('/:id', timesheetController.getTimeEntryById);

// POST /api/timesheet - Create new time entry
router.post('/', timesheetController.createTimeEntry);

// PUT /api/timesheet/:id - Update time entry
router.put('/:id', timesheetController.updateTimeEntry);

// PUT /api/timesheet/:id/approve - Approve time entry
router.put('/:id/approve', timesheetController.approveTimeEntry);

// PUT /api/timesheet/:id/reject - Reject time entry
router.put('/:id/reject', timesheetController.rejectTimeEntry);

// DELETE /api/timesheet/:id - Delete time entry
router.delete('/:id', timesheetController.deleteTimeEntry);

export default router;

