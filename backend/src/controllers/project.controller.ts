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
    if (page) filters.page = parseInt(page as string, 10);
    if (limit) filters.limit = parseInt(limit as string, 10);

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

    const project = await projectService.getProjectById(id as string);

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
    const { name, description, color, icon, startDate, endDate } = req.body;

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
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      ownerId: userId,
    });

    return sendSuccess(res, { project }, undefined, 201);
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

    const deleted = await projectService.deleteProject(id as string, userId);

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

    const stats = await projectService.getProjectStats(id as string);

    return sendSuccess(res, { stats });
  } catch (error) {
    return sendError(res, 'Failed to fetch project statistics', 500);
  }
};

/**
 * Get all project members
 */
export const getProjectMembers = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const members = await projectService.getProjectMembers(String(id));

    return sendSuccess(res, { members });
  } catch (error) {
    return sendError(res, 'Failed to fetch project members', 500);
  }
};

/**
 * Add member to project
 */
export const addProjectMember = async (
  req: Request,
  res: Response,
  _next: NextFunction
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
  } catch (error: any) {
    if (error.message === 'Only project owners and admins can add members') {
      return sendError(res, 'Only project owners and admins can add members', 403);
    }
    if (error.message === 'User is already a member of this project') {
      return sendError(res, 'User is already a member of this project', 400);
    }
    return sendError(res, 'Failed to add member', 500);
  }
};

/**
 * Update member role
 */
export const updateProjectMemberRole = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;
    const requesterId = extractUserId(req);

    if (!role || !['OWNER', 'ADMIN', 'MEMBER'].includes(role)) {
      return sendError(res, 'Valid role is required (OWNER, ADMIN, MEMBER)', 400);
    }

    const member = await projectService.updateMemberRole(String(id), String(memberId), role, requesterId);

    return sendSuccess(res, { member });
  } catch (error: any) {
    if (error.message === 'Only project owners can change member roles') {
      return sendError(res, 'Only project owners can change member roles', 403);
    }
    return sendError(res, 'Failed to update member role', 500);
  }
};

/**
 * Remove member from project
 */
export const removeProjectMember = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id, memberId } = req.params;
    const requesterId = extractUserId(req);

    await projectService.removeProjectMember(String(id), String(memberId), requesterId);

    return sendSuccess(res, { message: 'Member removed successfully' });
  } catch (error: any) {
    if (error.message === 'Only project owners and admins can remove members') {
      return sendError(res, 'Only project owners and admins can remove members', 403);
    }
    if (error.message === 'Cannot remove project owner') {
      return sendError(res, 'Cannot remove project owner', 400);
    }
    return sendError(res, 'Failed to remove member', 500);
  }
};
