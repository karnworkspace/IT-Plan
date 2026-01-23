import { Router } from 'express';
import {
  getTaskComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  getUserComments,
} from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task-specific comment routes
router.get('/tasks/:taskId/comments', getTaskComments);
router.post('/tasks/:taskId/comments', createComment);

// Individual comment routes
router.get('/comments/:id', getComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

// User-specific routes
router.get('/user/comments', getUserComments);

export default router;
