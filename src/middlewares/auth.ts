import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/User';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    ResponseUtil.error(res, 'MISSING_TOKEN', 'Access token is required', 401);
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.KEYCLOAK_PUBLIC_KEY.replace(/\\n/g, "\n"));
    const user = await UserModel.findByEmail(decoded.email);
    (req as any).user = user;
    (req as any).userId = decoded.id; // Add userId to request context for easier access
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      ResponseUtil.error(res, 'TOKEN_EXPIRED', 'Token has expired', 401);
      return;
    }
    
    if (error.name === 'JsonWebTokenError') {
      ResponseUtil.error(res, 'INVALID_TOKEN', 'Invalid token', 401);
      return;
    }

    ResponseUtil.error(res, 'TOKEN_ERROR', 'Token verification failed', 401);
  }
};
