import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message: message || 'Operation completed successfully'
    };
    
    return res.status(statusCode).json(response);
  }

  static successWithPagination<T>(
    res: Response, 
    data: T[], 
    page: number, 
    limit: number, 
    total: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      message: message || 'Data retrieved successfully',
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
    
    return res.status(200).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): Response {
    return this.success(res, data, message || 'Resource created successfully', 201);
  }

  static error(res: Response, code: string, message: string, statusCode: number = 400, details?: any): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details
      }
    };
    
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string, details?: any): Response {
    return this.error(res, 'BAD_REQUEST', message, 400, details);
  }

  static notFound(res: Response, resource: string = 'Resource'): Response {
    return this.error(res, 'NOT_FOUND', `${resource} not found`, 404);
  }

  static conflict(res: Response, message: string): Response {
    return this.error(res, 'CONFLICT', message, 409);
  }

  static validationError(res: Response, details: any): Response {
    return this.error(res, 'VALIDATION_ERROR', 'Validation failed', 422, details);
  }

  static internalError(res: Response, message?: string): Response {
    return this.error(
      res, 
      'INTERNAL_SERVER_ERROR', 
      message || 'Internal server error', 
      500
    );
  }
}
