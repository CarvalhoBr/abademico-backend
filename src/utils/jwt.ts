import jwt from 'jsonwebtoken';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: User['role'];
}

export class JwtUtil {
  static generateToken(user: Pick<User, 'id' | 'name' | 'email' | 'role'>): string {
    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '24h',
      algorithm: 'HS256'
    });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw error;
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
