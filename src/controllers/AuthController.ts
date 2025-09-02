import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ResponseUtil } from '../utils/response';
import { JwtUtil } from '../utils/jwt';
import { getResourcesByRole } from '../utils/resources';

export class AuthController {
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return ResponseUtil.error(res, 'INVALID_CREDENTIALS', 'Email not found', 401);
      }

      // Generate JWT token with user id and name
      const token = JwtUtil.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      return ResponseUtil.success(res, {
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }, 'Login successful');
    } catch (error: any) {
      console.error('Error during login:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async whoami(req: Request, res: Response): Promise<Response> {
    try {
      // User info comes from JWT middleware
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return ResponseUtil.error(res, 'UNAUTHORIZED', 'User not authenticated', 401);
      }

      // Get fresh user data from database
      const user = await UserModel.findById(userId);
      if (!user) {
        return ResponseUtil.error(res, 'USER_NOT_FOUND', 'User not found', 404);
      }

      // Get resources available for this user's role
      const resources = getResourcesByRole(user.role);

      return ResponseUtil.success(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        resources
      }, 'User data retrieved successfully');
    } catch (error: any) {
      console.error('Error in whoami:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
