import express, { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { authenticate, adminOnly } from '../middleware/auth';
import Order from '../models/Order';
import { orderSchema, orderStatusSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Create order
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validated = orderSchema.parse(req.body);

    const order = new Order({
      userId: req.userId || null,
      customer: validated.customer,
      items: validated.items,
      total: validated.total,
      paymentMethod: 'COD',
      status: 'pending',
    });

    await order.save();

    logger.info('Order created:', order._id);

    res.status(201).json({
      id: order._id.toString(),
      ...order.toObject(),
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(400).json({ error: String(error) });
  }
});

// Get all orders (admin only)
router.get('/', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(
      orders.map((o) => ({
        id: o._id.toString(),
        ...o.toObject(),
      }))
    );
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get user orders
router.get('/user/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Users can only see their own orders
    if (req.userId !== req.params.userId) {
      throw new AppError(403, 'Forbidden');
    }

    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(
      orders.map((o) => ({
        id: o._id.toString(),
        ...o.toObject(),
      }))
    );
  } catch (error) {
    logger.error('Get user orders error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    res.json({
      id: order._id.toString(),
      ...order.toObject(),
    });
  } catch (error) {
    logger.error('Get order error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const validated = orderStatusSchema.parse(req.body);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: validated.status },
      { new: true }
    );

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    logger.info(`Order status updated: ${order._id} -> ${validated.status}`);

    res.json({
      id: order._id.toString(),
      ...order.toObject(),
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(400).json({ error: String(error) });
  }
});

// Delete order (admin only)
router.delete('/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    logger.info('Order deleted:', order._id);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    logger.error('Delete order error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: String(error) });
  }
});

export default router;
