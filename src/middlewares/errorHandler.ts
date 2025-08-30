import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique constraint violation
        return ResponseUtil.conflict(res, 'Resource already exists');
      case '23503': // Foreign key constraint violation
        return ResponseUtil.badRequest(res, 'Referenced resource does not exist');
      case '23502': // Not null constraint violation
        return ResponseUtil.badRequest(res, 'Required field is missing');
      case '22P02': // Invalid input syntax
        return ResponseUtil.badRequest(res, 'Invalid data format');
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return ResponseUtil.validationError(res, err.details);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseUtil.error(res, 'INVALID_TOKEN', 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseUtil.error(res, 'TOKEN_EXPIRED', 'Token expired', 401);
  }

  // Default error
  return ResponseUtil.internalError(res, 
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  return ResponseUtil.error(res, 'NOT_FOUND', 'Endpoint not found', 404, {
    method: req.method,
    path: req.originalUrl
  });
};
