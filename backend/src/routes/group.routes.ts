import { Router } from 'express';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  addGroupProject,
  removeGroupProject,
} from '../controllers/group.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Group CRUD
router.get('/', getGroups);
router.get('/:id', getGroup);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

// Group Members
router.post('/:id/members', addGroupMember);
router.delete('/:id/members/:userId', removeGroupMember);

// Group Projects
router.post('/:id/projects', addGroupProject);
router.delete('/:id/projects/:projectId', removeGroupProject);

export default router;
