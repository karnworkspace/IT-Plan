import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
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

export default router;
