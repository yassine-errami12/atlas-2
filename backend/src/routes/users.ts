import express, { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { adminOnly } from '../middleware/auth';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all users (admin only)
router.get('/', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
      }))
    );
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user (admin only)
router.get('/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    logger.error('Get user error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
