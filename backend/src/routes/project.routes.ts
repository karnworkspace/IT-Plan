import { Router } from 'express';
import { authenticate, requireManager } from '../middlewares/auth.middleware';
import { validateUUID } from '../middlewares/validate.middleware';
import {
  getTimeline,
  getMyProjects,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  reorderProjects,
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from '../controllers/project.controller';

const router = Router();

// All project routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects with filters and pagination
 * @access  Private
 */
/**
 * @route   GET /api/v1/projects/timeline
 * @desc    Get all projects for Annual Plan Timeline view
 * @access  Private
 */
router.get('/timeline', getTimeline);
router.patch('/reorder', reorderProjects);

/**
 * @route   GET /api/v1/projects/my
 * @desc    Get projects where current user is owner or member
 * @access  Private
 */
router.get('/my', getMyProjects);

router.get('/', getProjects);

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
// MEMBER สร้างได้เฉพาะ INTERNAL, MANAGER/ADMIN สร้างได้ทุกประเภท
router.post('/', (req, res, next) => {
  const authReq = req as any;
  const projectType = req.body.projectType || 'PROJECT';
  if (projectType === 'INTERNAL') {
    // ทุก role สร้าง Internal ได้
    next();
  } else {
    // PROJECT ต้องเป็น MANAGER ขึ้นไป
    requireManager(req, res, next);
  }
}, createProject);

/**
 * @route   GET /api/v1/projects/:id/stats
 * @desc    Get project statistics
 * @access  Private
 */
router.get('/:id/stats', validateUUID('id'), getProjectStats);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', validateUUID('id'), getProject);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private (owner only)
 */
router.put('/:id', validateUUID('id'), updateProject);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project
 * @access  Private (owner only)
 */
router.delete('/:id', validateUUID('id'), deleteProject);

/**
 * @route   GET /api/v1/projects/:id/members
 * @desc    Get all project members
 * @access  Private
 */
router.get('/:id/members', validateUUID('id'), getProjectMembers);

/**
 * @route   POST /api/v1/projects/:id/members
 * @desc    Add member to project
 * @access  Private (owner/admin only)
 */
router.post('/:id/members', validateUUID('id'), addProjectMember);

/**
 * @route   PUT /api/v1/projects/:id/members/:memberId
 * @desc    Update member role
 * @access  Private (owner only)
 */
router.put('/:id/members/:memberId', validateUUID('id', 'memberId'), updateProjectMemberRole);

/**
 * @route   DELETE /api/v1/projects/:id/members/:memberId
 * @desc    Remove member from project
 * @access  Private (owner/admin only)
 */
router.delete('/:id/members/:memberId', validateUUID('id', 'memberId'), removeProjectMember);

export default router;
