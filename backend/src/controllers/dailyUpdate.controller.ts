import { Request, Response, NextFunction } from 'express';
import dailyUpdateService, {
  CreateDailyUpdateInput,
  UpdateDailyUpdateInput,
} from '../services/dailyUpdate.service';
import { DAILY_UPDATE_STATUSES } from '../constants';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';

/**
 * Get all daily updates for a task
 */
export const getTaskUpdates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params as { taskId: string };

    const updates = await dailyUpdateService.getTaskUpdates(taskId);
    return sendSuccess(res, { updates }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily update by ID
 */
export const getDailyUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    const update = await dailyUpdateService.getUpdateById(id);

    if (!update) {
      return sendError(res, 'Daily update not found', 404);
    }

    return sendSuccess(res, { update }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Create new daily update
 */
export const createDailyUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params as { taskId: string };
    const userId = extractUserId(req);

    // Validation
    const { progress, status, notes } = req.body;

    if (progress === undefined) {
      return sendError(res, 'Progress is required', 400);
    }

    if (progress < 0 || progress > 100) {
      return sendError(res, 'Progress must be between 0 and 100', 400);
    }

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    if (!(DAILY_UPDATE_STATUSES as readonly string[]).includes(status)) {
      return sendError(res, 'Invalid status value', 400);
    }

    if (notes && notes.length > 500) {
      return sendError(res, 'Notes must be less than 500 characters', 400);
    }

    const updateData: CreateDailyUpdateInput = {
      taskId,
      progress,
      status,
      notes,
    };

    const update = await dailyUpdateService.createDailyUpdate(updateData, userId);
    return sendSuccess(res, { update }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update daily update
 */
export const updateDailyUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    // Validation
    const { progress, status, notes } = req.body;

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return sendError(res, 'Progress must be between 0 and 100', 400);
    }

    if (status) {
      const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];
      if (!validStatuses.includes(status)) {
        return sendError(res, 'Invalid status value', 400);
      }
    }

    if (notes && notes.length > 500) {
      return sendError(res, 'Notes must be less than 500 characters', 400);
    }

    const updateData: UpdateDailyUpdateInput = {
      progress,
      status,
      notes,
    };

    const update = await dailyUpdateService.updateDailyUpdate(id, updateData, userId);

    return sendSuccess(res, { update }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete daily update
 */
export const deleteDailyUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const deleted = await dailyUpdateService.deleteDailyUpdate(id, userId);

    if (!deleted) {
      return sendError(res, 'Daily update not found', 404);
    }

    return sendSuccess(res, { message: 'Daily update deleted successfully' }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily updates for a date range
 */
export const getUpdatesByDateRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params as { taskId: string };

    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return sendError(res, 'Start date and end date are required', 400);
    }

    const startDate = new Date(start_date as string);
    const endDate = new Date(end_date as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendError(res, 'Invalid date format', 400);
    }

    if (startDate > endDate) {
      return sendError(res, 'Start date must be before end date', 400);
    }

    const updates = await dailyUpdateService.getUpdatesByDateRange(taskId, startDate, endDate);
    return sendSuccess(res, { updates }, '200');
  } catch (error) {
    next(error);
  }
};
