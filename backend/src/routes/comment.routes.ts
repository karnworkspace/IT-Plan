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
import { validateUUID } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task-specific comment routes
router.get('/tasks/:taskId/comments', validateUUID('taskId'), getTaskComments);
router.post('/tasks/:taskId/comments', validateUUID('taskId'), createComment);

// Individual comment routes
router.get('/comments/:id', validateUUID('id'), getComment);
router.put('/comments/:id', validateUUID('id'), updateComment);
router.delete('/comments/:id', validateUUID('id'), deleteComment);

// User-specific routes
router.get('/user/comments', getUserComments);

export default router;
