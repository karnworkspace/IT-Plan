import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from '../controllers/project.controller';

const router = Router();

// All project routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects with filters and pagination
 * @access  Private
 */
router.get('/', getProjects);

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', createProject);

/**
 * @route   GET /api/v1/projects/:id/stats
 * @desc    Get project statistics
 * @access  Private
 */
router.get('/:id/stats', getProjectStats);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', getProject);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private (owner only)
 */
router.put('/:id', updateProject);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project
 * @access  Private (owner only)
 */
router.delete('/:id', deleteProject);

/**
 * @route   GET /api/v1/projects/:id/members
 * @desc    Get all project members
 * @access  Private
 */
router.get('/:id/members', getProjectMembers);

/**
 * @route   POST /api/v1/projects/:id/members
 * @desc    Add member to project
 * @access  Private (owner/admin only)
 */
router.post('/:id/members', addProjectMember);

/**
 * @route   PUT /api/v1/projects/:id/members/:memberId
 * @desc    Update member role
 * @access  Private (owner only)
 */
router.put('/:id/members/:memberId', updateProjectMemberRole);

/**
 * @route   DELETE /api/v1/projects/:id/members/:memberId
 * @desc    Remove member from project
 * @access  Private (owner/admin only)
 */
router.delete('/:id/members/:memberId', removeProjectMember);

export default router;
