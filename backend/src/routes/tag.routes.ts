import { Router } from 'express';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
} from '../controllers/tag.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/tags', getAllTags);
router.post('/tags', createTag);
router.put('/tags/:id', updateTag);
router.delete('/tags/:id', deleteTag);

export default router;
