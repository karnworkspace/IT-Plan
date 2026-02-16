import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';
import projectService from '../services/project.service';
import { PROJECT_STATUSES, MEMBER_ROLES } from '../constants';

/**
 * Get timeline data (Annual Plan view)
 */
export const getTimeline = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await projectService.getTimelineData();
    return sendSuccess(res, { projects: data });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects
 */
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, owner_id, page, limit } = req.query;

    const filters: Record<string, string | number> = {};
    if (status) filters.status = status as string;
    if (owner_id) filters.ownerId = owner_id as string;
    if (page) filters.page = parseInt(page as string, 10);
    if (limit) filters.limit = parseInt(limit as string, 10);

    const result = await projectService.getAllProjects(filters);

    return sendSuccess(res, {
      projects: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by ID
 */
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const project = await projectService.getProjectById(id as string);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, { project });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new project
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = extractUserId(req);
    const { name, description, color, icon, status, startDate, endDate } = req.body;

    // Validation
    if (!name || (typeof name === 'string' && name.trim().length === 0)) {
      return sendError(res, 'Project name is required', 400);
    }

    if (typeof name === 'string' && name.length > 100) {
      return sendError(res, 'Project name must be less than 100 characters', 400);
    }

    // Validate status if provided
    if (status) {
      if (!(PROJECT_STATUSES as readonly string[]).includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${PROJECT_STATUSES.join(', ')}`, 400);
      }
    }

    const project = await projectService.createProject({
      name: typeof name === 'string' ? name.trim() : name,
      description: description ? (typeof description === 'string' ? description.trim() : description) : undefined,
      color,
      icon,
      status: status || 'ACTIVE',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      ownerId: userId,
    });

    return sendSuccess(res, { project }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);
    const { name, description, color, icon, status, startDate, endDate } = req.body;

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

    // Validate status if provided
    if (status !== undefined) {
      if (!(PROJECT_STATUSES as readonly string[]).includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${PROJECT_STATUSES.join(', ')}`, 400);
      }
    }

    const updateData = {
      name: name !== undefined ? (typeof name === 'string' ? name.trim() : String(name)) : undefined,
      description: description !== undefined ? (typeof description === 'string' ? description.trim() : description) : undefined,
      color,
      icon,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const project = await projectService.updateProject(id as string, updateData, userId);

    if (!project) {
      return sendError(res, 'Project not found or you do not have permission', 404);
    }

    return sendSuccess(res, { project });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);

    const deleted = await projectService.deleteProject(id as string, userId);

    if (!deleted) {
      return sendError(res, 'Project not found or you do not have permission', 404);
    }

    return sendSuccess(res, { message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project statistics
 */
export const getProjectStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const stats = await projectService.getProjectStats(id as string);

    return sendSuccess(res, { stats });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all project members
 */
export const getProjectMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const members = await projectService.getProjectMembers(String(id));

    return sendSuccess(res, { members });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to project
 */
export const addProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId, role = 'MEMBER' } = req.body;
    const requesterId = extractUserId(req);

    if (!userId) {
      return sendError(res, 'userId is required', 400);
    }

    const member = await projectService.addProjectMember(id as string, userId, role, requesterId);

    return sendSuccess(res, { member }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update member role
 */
export const updateProjectMemberRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;
    const requesterId = extractUserId(req);

    if (!role || !(MEMBER_ROLES as readonly string[]).includes(role)) {
      return sendError(res, `Valid role is required (${MEMBER_ROLES.join(', ')})`, 400);
    }

    const member = await projectService.updateMemberRole(String(id), String(memberId), role, requesterId);

    return sendSuccess(res, { member });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from project
 */
export const removeProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, memberId } = req.params;
    const requesterId = extractUserId(req);

    await projectService.removeProjectMember(String(id), String(memberId), requesterId);

    return sendSuccess(res, { message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder projects within a status column
 */
export const reorderProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectIds } = req.body;

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return sendError(res, 'projectIds array is required', 400);
    }

    await projectService.reorderProjects(projectIds);
    return sendSuccess(res, { message: 'Projects reordered' });
  } catch (error) {
    next(error);
  }
};
