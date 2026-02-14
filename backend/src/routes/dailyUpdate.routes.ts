import { Router } from 'express';
import {
  getTaskUpdates,
  getDailyUpdate,
  createDailyUpdate,
  updateDailyUpdate,
  deleteDailyUpdate,
  getUpdatesByDateRange,
} from '../controllers/dailyUpdate.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateUUID } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task-specific daily update routes
router.get('/tasks/:taskId/updates', validateUUID('taskId'), getTaskUpdates);
router.get('/tasks/:taskId/updates/range', validateUUID('taskId'), getUpdatesByDateRange);
router.post('/tasks/:taskId/updates', validateUUID('taskId'), createDailyUpdate);

// Individual daily update routes
router.get('/updates/:id', validateUUID('id'), getDailyUpdate);
router.put('/updates/:id', validateUUID('id'), updateDailyUpdate);
router.delete('/updates/:id', validateUUID('id'), deleteDailyUpdate);

export default router;
