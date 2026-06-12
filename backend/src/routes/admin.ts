import express, { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { authenticate } from '../middleware/auth';
import User from '../models/User';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { loginSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * Admin Login Endpoint
 * POST /api/admin/login
 * 
 * Request body:
 * {
 *   "email": "admin@atlas.ma",
 *   "password": "admin123"
 * }
 * 
 * Response:
 * {
 *   "user": {
 *     "id": "userId",
 *     "name": "Admin Name",
 *     "email": "admin@atlas.ma",
 *     "role": "admin"
 *   },
 *   "token": "jwt_token",
 *   "expiresIn": 86400
 * }
 */
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email: validated.email.toLowerCase() });
    if (!user) {
      logger.warn('Admin login attempt with non-existent email:', validated.email);
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify admin role
    if (user.role !== 'admin') {
      logger.warn('Non-admin user attempted admin login:', validated.email);
      throw new AppError(403, 'Admin access required');
    }

    // Check password
    const passwordMatch = await comparePassword(validated.password, user.password);
    if (!passwordMatch) {
      logger.warn('Admin login attempt with wrong password:', validated.email);
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info('Admin logged in:', user.email);

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      expiresIn: 86400, // 24 hours in seconds
    });
  } catch (error) {
    logger.error('Admin login error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(400).json({ error: String(error) });
  }
});

/**
 * Admin Session Verification
 * GET /api/admin/verify
 * 
 * Headers:
 * {
 *   "Authorization": "Bearer jwt_token"
 * }
 * 
 * Response:
 * {
 *   "valid": true,
 *   "user": {
 *     "id": "userId",
 *     "email": "admin@atlas.ma",
 *     "role": "admin"
 *   }
 * }
 */
router.get('/verify', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'No token provided');
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    if (user.role !== 'admin') {
      throw new AppError(403, 'Admin access required');
    }

    logger.info('Admin session verified:', user.email);

    res.json({
      valid: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Admin verification error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message, valid: false });
    }
    res.status(400).json({ error: String(error), valid: false });
  }
});

export default router;
