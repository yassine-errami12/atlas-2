import express, { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { authenticate, adminOnly } from '../middleware/auth';
import Product from '../models/Product';
import { productSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all products
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }
    res.json(product);
  } catch (error) {
    logger.error('Get product error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const validated = productSchema.parse(req.body);

    const product = new Product(validated);
    await product.save();

    logger.info('Product created:', product._id);

    res.status(201).json(product);
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(400).json({ error: String(error) });
  }
});

// Update product (admin only)
router.put('/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const validated = productSchema.partial().parse(req.body);

    const product = await Product.findByIdAndUpdate(req.params.id, validated, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    logger.info('Product updated:', product._id);

    res.json(product);
  } catch (error) {
    logger.error('Update product error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(400).json({ error: String(error) });
  }
});

// Delete product (admin only)
router.delete('/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    logger.info('Product deleted:', product._id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Delete product error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: String(error) });
  }
});

// Get products by category
router.get('/category/:category', async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    logger.error('Get products by category error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
