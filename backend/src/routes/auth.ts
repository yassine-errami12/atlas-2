import express, { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check if user already exists
    const existing = await User.findOne({ email: validated.email.toLowerCase() });
    if (existing) {
      throw new AppError(400, 'Email already registered');
    }

    // Create new user
    const user = new User({
      name: validated.name,
      email: validated.email.toLowerCase(),
      password: await hashPassword(validated.password),
      role: 'user',
    });

    await user.save();

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info('User registered:', user.email);

    res.status(201).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error('Register error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(400).json({ error: String(error) });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email: validated.email.toLowerCase() });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check password
    const passwordMatch = await comparePassword(validated.password, user.password);
    if (!passwordMatch) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info('User logged in:', user.email);

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(400).json({ error: String(error) });
  }
});

// Get current user
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await User.findById(req.userId);
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
    logger.error('Get current user error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: String(error) });
  }
});

export default router;
