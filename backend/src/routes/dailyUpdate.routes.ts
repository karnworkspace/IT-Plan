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

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task-specific daily update routes
router.get('/tasks/:taskId/updates', getTaskUpdates);
router.get('/tasks/:taskId/updates/range', getUpdatesByDateRange);
router.post('/tasks/:taskId/updates', createDailyUpdate);

// Individual daily update routes
router.get('/updates/:id', getDailyUpdate);
router.put('/updates/:id', updateDailyUpdate);
router.delete('/updates/:id', deleteDailyUpdate);

export default router;
