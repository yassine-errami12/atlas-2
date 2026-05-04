import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['Audio', 'Wearables', 'Charge', 'Accessoires', 'Gaming']),
  brand: z.enum(['Atlas', 'Sahara', 'MedinaTech', 'Argan', 'Casablanca']),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  image: z.string().url('Image must be a valid URL'),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().regex(/^[0-9+\s]{8,}$/, 'Invalid phone number'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      title: z.string(),
      price: z.number().positive(),
      image: z.string(),
      quantity: z.number().positive(),
    })
  ),
  total: z.number().positive(),
});

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'shipped', 'delivered']),
});
