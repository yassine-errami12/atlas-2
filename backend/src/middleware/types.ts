import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface DecodedToken {
  id: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

export type Category = 'Audio' | 'Wearables' | 'Charge' | 'Accessoires' | 'Gaming';
export type Brand = 'Atlas' | 'Sahara' | 'MedinaTech' | 'Argan' | 'Casablanca';
export type OrderStatus = 'pending' | 'shipped' | 'delivered';
