import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'fallback-secret') as Secret;
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION || '7d') as SignOptions['expiresIn'];

export interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};
