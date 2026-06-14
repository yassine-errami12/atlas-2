import express, { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { authenticate } from '../middleware/auth';
import Review from '../models/Review';
import Product from '../models/Product';
import User from '../models/User';
import { reviewSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(
      reviews.map((r) => ({
        id: r._id.toString(),
        productId: r.productId.toString(),
        userId:
          r.userId && typeof r.userId === 'object' && '_id' in r.userId
            ? r.userId._id.toString()
            : null,
        author: r.author,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    );
  } catch (error) {
    logger.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review (authenticated users only)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const validated = reviewSchema.parse(req.body);

    // Check if product exists
    const product = await Product.findById(validated.productId);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    const user = await User.findById(req.userId);

    const review = new Review({
      productId: validated.productId,
      userId: req.userId,
      author: user?.name || req.user?.email || 'Anonymous',
      rating: validated.rating,
      comment: validated.comment,
    });

    await review.save();

    // Update product rating
    const productReviews = await Review.find({ productId: validated.productId });
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    await Product.findByIdAndUpdate(validated.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: productReviews.length,
    });

    logger.info('Review created:', review._id);

    res.status(201).json({
      id: review._id.toString(),
      productId: review.productId.toString(),
      userId: review.userId.toString(),
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().slice(0, 10),
    });
  } catch (error) {
    logger.error('Create review error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(400).json({ error: String(error) });
  }
});

// Delete review (admin only or owner)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    // Check if user is owner or admin
    const user = await User.findById(req.userId);
    if (review.userId.toString() !== req.userId && user?.role !== 'admin') {
      throw new AppError(403, 'Forbidden');
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const productReviews = await Review.find({ productId: review.productId });
    if (productReviews.length > 0) {
      const avgRating =
        productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await Product.findByIdAndUpdate(review.productId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: productReviews.length,
      });
    } else {
      await Product.findByIdAndUpdate(review.productId, {
        rating: 0,
        reviewsCount: 0,
      });
    }

    logger.info('Review deleted:', req.params.id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    logger.error('Delete review error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: String(error) });
  }
});

export default router;
