import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import taskService, {
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from '../services/task.service';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';

/**
 * Get all tasks in a project
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params as { projectId: string };
    const userId = extractUserId(req);

    // Build filters
    const filters: TaskFilters = {
      projectId,
      status: req.query.status as string | undefined,
      assigneeId: req.query.assignee_id as string | undefined,
      priority: req.query.priority as string | undefined,
      dueDateFrom: req.query.due_date_from ? new Date(req.query.due_date_from as string) : undefined,
      dueDateTo: req.query.due_date_to ? new Date(req.query.due_date_to as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await taskService.getAllTasks(filters);
    return sendSuccess(res, { tasks: result.data, pagination: result.pagination }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get task by ID
 */
export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    const task = await taskService.getTaskById(id);

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    return sendSuccess(res, { task }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new task
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params as { projectId: string };
    const userId = extractUserId(req);

    // Validation
    const { title, description, assigneeId, priority, dueDate, startDate } = req.body;

    if (!title) {
      return sendError(res, 'Title is required', 400);
    }

    if (title.length > 200) {
      return sendError(res, 'Title must be less than 200 characters', 400);
    }

    if (description && description.length > 2000) {
      return sendError(res, 'Description must be less than 2000 characters', 400);
    }

    // Validate status (not needed for create, defaults to TODO)
    // Validate priority if provided
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (priority && !validPriorities.includes(priority)) {
      return sendError(res, 'Invalid priority value', 400);
    }

    // Validate dates
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;

    if (startDateObj && isNaN(startDateObj.getTime())) {
      return sendError(res, 'Invalid start date', 400);
    }

    if (dueDateObj && isNaN(dueDateObj.getTime())) {
      return sendError(res, 'Invalid due date', 400);
    }

    if (startDateObj && dueDateObj && startDateObj > dueDateObj) {
      return sendError(res, 'Start date must be before due date', 400);
    }

    // Validate assigneeId if provided
    if (assigneeId) {
      // Check if user exists
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: { id: assigneeId },
      });
      if (!user) {
        return sendError(res, 'Assignee not found', 404);
      }
    }

    const taskData: CreateTaskInput = {
      title,
      description,
      projectId,
      createdById: userId,
      assigneeId,
      priority,
      startDate: startDateObj,
      dueDate: dueDateObj,
    };

    const task = await taskService.createTask(taskData);
    return sendSuccess(res, { task }, '201');
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    // Validation
    const { title, description, status, priority, assigneeId, dueDate, startDate, progress } = req.body;

    if (title && title.length > 200) {
      return sendError(res, 'Title must be less than 200 characters', 400);
    }

    if (description && description.length > 2000) {
      return sendError(res, 'Description must be less than 2000 characters', 400);
    }

    // Validate status if provided
    const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];
    if (status && !validStatuses.includes(status)) {
      return sendError(res, 'Invalid status value', 400);
    }

    // Validate priority if provided
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (priority && !validPriorities.includes(priority)) {
      return sendError(res, 'Invalid priority value', 400);
    }

    // Validate progress if provided
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return sendError(res, 'Progress must be between 0 and 100', 400);
    }

    // Validate dates
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;

    if (startDateObj && isNaN(startDateObj.getTime())) {
      return sendError(res, 'Invalid start date', 400);
    }

    if (dueDateObj && isNaN(dueDateObj.getTime())) {
      return sendError(res, 'Invalid due date', 400);
    }

    if (startDateObj && dueDateObj && startDateObj > dueDateObj) {
      return sendError(res, 'Start date must be before due date', 400);
    }

    // Validate assigneeId if provided
    if (assigneeId) {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: { id: assigneeId },
      });
      if (!user) {
        return sendError(res, 'Assignee not found', 404);
      }
    }

    const taskData: UpdateTaskInput = {
      title,
      description,
      status,
      priority,
      assigneeId,
      startDate: startDateObj,
      dueDate: dueDateObj,
      progress,
    };

    const task = await taskService.updateTask(id, taskData, userId);

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    return sendSuccess(res, { task }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const deleted = await taskService.deleteTask(id, userId);

    if (!deleted) {
      return sendError(res, 'Task not found', 404);
    }

    return sendSuccess(res, { message: 'Task deleted successfully' }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Update task status and progress
 */
export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const { status, progress } = req.body;

    // Validation
    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status value', 400);
    }

    if (progress === undefined) {
      return sendError(res, 'Progress is required', 400);
    }

    if (progress < 0 || progress > 100) {
      return sendError(res, 'Progress must be between 0 and 100', 400);
    }

    const task = await taskService.updateTaskStatus(id, status, progress, userId);

    return sendSuccess(res, { task }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks assigned to or created by the current user
 */
export const getMyTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    const filters = {
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    };

    const result = await taskService.getMyTasks(authReq.user, filters);
    return sendSuccess(res, { tasks: result.data, pagination: result.pagination }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get task statistics for a project
 */
export const getTaskStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params as { projectId: string };

    const stats = await taskService.getTaskStats(projectId);

    return sendSuccess(res, { stats }, '200');
  } catch (error) {
    next(error);
  }
};
