import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';
import projectService from '../services/project.service';

/**
 * Get all projects
 */
export const getProjects = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { status, owner_id, page, limit } = _req.query;

    const filters: any = {};
    if (status) filters.status = status as string;
    if (owner_id) filters.ownerId = owner_id as string;
    if (page) filters.page = parseInt(page as string);
    if (limit) filters.limit = parseInt(limit as string);

    const result = await projectService.getAllProjects(filters);

    return sendSuccess(res, {
      projects: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch projects', 500);
  }
};

/**
 * Get project by ID
 */
export const getProject = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const project = await projectService.getProjectById(id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, { project });
  } catch (error) {
    return sendError(res, 'Failed to fetch project', 500);
  }
};

/**
 * Create new project
 */
export const createProject = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = extractUserId(req);
    const { name, description, color, icon } = req.body;

    // Validation
    if (!name || (typeof name === 'string' && name.trim().length === 0)) {
      return sendError(res, 'Project name is required', 400);
    }

    if (typeof name === 'string' && name.length > 100) {
      return sendError(res, 'Project name must be less than 100 characters', 400);
    }

    const project = await projectService.createProject({
      name: typeof name === 'string' ? name.trim() : name,
      description: description ? (typeof description === 'string' ? description.trim() : description) : undefined,
      color,
      icon,
      ownerId: userId,
    });

    return sendSuccess(res, { project }, 201);
  } catch (error) {
    return sendError(res, 'Failed to create project', 500);
  }
};

/**
 * Update project
 */
export const updateProject = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);
    const { name, description, color, icon, status } = req.body;

    // Validation
    if (name !== undefined) {
      const nameStr = typeof name === 'string' ? name : String(name);
      if (nameStr.trim().length === 0) {
        return sendError(res, 'Project name cannot be empty', 400);
      }
      if (nameStr.length > 100) {
        return sendError(res, 'Project name must be less than 100 characters', 400);
      }
    }

    const project = await projectService.updateProject(
      id,
      {
        name: name !== undefined ? (typeof name === 'string' ? name.trim() : String(name)) : undefined,
        description: description !== undefined ? (typeof description === 'string' ? description.trim() : description) : undefined,
        color,
        icon,
        status,
      },
      userId
    );

    if (!project) {
      return sendError(res, 'Project not found or you do not have permission', 404);
    }

    return sendSuccess(res, { project });
  } catch (error: any) {
    if (error.message === 'You do not have permission to update this project') {
      return sendError(res, 'You do not have permission to update this project', 403);
    }
    return sendError(res, 'Failed to update project', 500);
  }
};

/**
 * Delete project
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);

    const deleted = await projectService.deleteProject(id, userId);

    if (!deleted) {
      return sendError(res, 'Project not found or you do not have permission', 404);
    }

    return sendSuccess(res, { message: 'Project deleted successfully' });
  } catch (error: any) {
    if (error.message === 'You do not have permission to delete this project') {
      return sendError(res, 'You do not have permission to delete this project', 403);
    }
    return sendError(res, 'Failed to delete project', 500);
  }
};

/**
 * Get project statistics
 */
export const getProjectStats = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const stats = await projectService.getProjectStats(id);

    return sendSuccess(res, { stats });
  } catch (error) {
    return sendError(res, 'Failed to fetch project statistics', 500);
  }
};
