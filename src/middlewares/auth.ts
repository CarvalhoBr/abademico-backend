import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { ResponseUtil } from '../utils/response';
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/User';
import { getResourcesByRole } from '../utils/resources';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ResponseUtil.error(res, 'MISSING_TOKEN', 'Access token is required', 401);
    return;
  }

  try {
    const decoded = JwtUtil.verifyToken(token);
    (req as any).user = decoded;
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

export const authScope = (scope: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ResponseUtil.error(res, 'MISSING_TOKEN', 'Access token is required', 401);
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.KEYCLOAK_PUBLIC_KEY?.replace(/\\n/g, "\n")!, {
      algorithms: ['RS256']
    })
    const data = (typeof decoded === 'object') ? decoded : JSON.parse(decoded)
    if(data.email){
      const user = await UserModel.findByEmail(data.email);
      (req as any).user = user;
      (req as any).userId = user?.id;
    }
    const roles = decoded.resource_access[process.env.KEYCLOAK_CLIENT!].roles
    let hasAccess = false
    roles.forEach((role: string) => {
      const resources = getResourcesByRole(role)
      const [resourceName, action] = scope.split(':')
      const resource = resources.find(r => r.name === resourceName)
      if(resource?.actions.includes(action!)){
        hasAccess = true
      }
    })
    if (!hasAccess){
      ResponseUtil.error(res, 'FORBIDEN', 'Não autorizado', 403)
      return
    }
    next()
  } catch (error) {
    throw error
  }
  }
}
