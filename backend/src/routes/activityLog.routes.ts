import { Router } from 'express';
import {
  getProjectActivities,
  getTaskActivities,
  getUserActivities,
  getRecentActivities,
} from '../controllers/activityLog.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All activity log routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/activities/recent
 * @desc    Get recent activities across all users (for Dashboard)
 * @access  Private
 */
router.get('/activities/recent', getRecentActivities);

/**
 * @route   GET /api/v1/projects/:projectId/activities
 * @desc    Get all activities for a project
 * @access  Private
 */
router.get('/projects/:projectId/activities', getProjectActivities);

/**
 * @route   GET /api/v1/tasks/:taskId/activities
 * @desc    Get all activities for a task
 * @access  Private
 */
router.get('/tasks/:taskId/activities', getTaskActivities);

/**
 * @route   GET /api/v1/users/:userId/activities
 * @desc    Get all activities for a user
 * @access  Private
 */
router.get('/users/:userId/activities', getUserActivities);

export default router;
