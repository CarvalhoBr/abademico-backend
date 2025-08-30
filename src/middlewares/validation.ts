import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ResponseUtil } from '../utils/response';

export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      ResponseUtil.validationError(res, details);
      return;
    }
    
    req.body = value;
    next();
  };
};

export const validateParams = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      ResponseUtil.validationError(res, details);
      return;
    }
    
    req.params = value;
    next();
  };
};

export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      ResponseUtil.validationError(res, details);
      return;
    }
    
    req.query = value;
    next();
  };
};
