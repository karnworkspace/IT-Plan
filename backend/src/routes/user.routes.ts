import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { getUsers, updateUser, resetUserPassword } from '../controllers/user.controller';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get('/', getUsers);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user (admin only)
 * @access  Private (Admin)
 */
router.put('/:id', updateUser);

/**
 * @route   POST /api/v1/users/:id/reset-password
 * @desc    Reset user password (admin only)
 * @access  Private (Admin)
 */
router.post('/:id/reset-password', resetUserPassword);

export default router;
