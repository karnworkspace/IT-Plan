import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats,
} from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Project-specific task routes
router.get('/projects/:projectId/tasks', getTasks);
router.get('/projects/:projectId/tasks/stats', getTaskStats);
router.post('/projects/:projectId/tasks', createTask);

// Individual task routes
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.patch('/tasks/:id/status', updateTaskStatus);

export default router;
