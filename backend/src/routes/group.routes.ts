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
import { validateUUID } from '../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

// Group CRUD
router.get('/', getGroups);
router.get('/:id', validateUUID('id'), getGroup);
router.post('/', createGroup);
router.put('/:id', validateUUID('id'), updateGroup);
router.delete('/:id', validateUUID('id'), deleteGroup);

// Group Members
router.post('/:id/members', validateUUID('id'), addGroupMember);
router.delete('/:id/members/:userId', validateUUID('id', 'userId'), removeGroupMember);

// Group Projects
router.post('/:id/projects', validateUUID('id'), addGroupProject);
router.delete('/:id/projects/:projectId', validateUUID('id', 'projectId'), removeGroupProject);

export default router;
