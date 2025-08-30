import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { ResponseUtil } from '../utils/response';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    ResponseUtil.error(res, 'MISSING_TOKEN', 'Access token is required', 401);
    return;
  }

  try {
    const decoded = JwtUtil.verifyToken(token);
    (req as any).user = decoded;
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
