import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats,
  getMyTasks,
  getSubTasks,
} from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateUUID } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Project-specific task routes
router.get('/projects/:projectId/tasks', validateUUID('projectId'), getTasks);
router.get('/projects/:projectId/tasks/stats', validateUUID('projectId'), getTaskStats);
router.post('/projects/:projectId/tasks', validateUUID('projectId'), createTask);

// My tasks route (tasks assigned to or created by current user)
router.get('/my-tasks', getMyTasks);

// Individual task routes
router.get('/tasks/:id', validateUUID('id'), getTask);
router.get('/tasks/:id/subtasks', validateUUID('id'), getSubTasks);
router.put('/tasks/:id', validateUUID('id'), updateTask);
router.delete('/tasks/:id', validateUUID('id'), deleteTask);
router.patch('/tasks/:id/status', validateUUID('id'), updateTaskStatus);

export default router;
