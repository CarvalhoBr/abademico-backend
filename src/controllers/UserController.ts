import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { CourseModel } from '../models/Course';
import { ResponseUtil } from '../utils/response';

export class UserController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserModel.findAll();
      return ResponseUtil.success(res, users, 'Users retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id!);
      
      if (!user) {
        return ResponseUtil.notFound(res, 'User');
      }
      
      return ResponseUtil.success(res, user, 'User retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching user:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { role } = req.params;
      const userData = { ...req.body, role };

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return ResponseUtil.conflict(res, 'Email already exists');
      }

      // Validate courseIds for students
      if (userData.role === 'student' && (!userData.courseIds || userData.courseIds.length === 0)) {
        return ResponseUtil.badRequest(res, 'Course IDs are required for students');
      }

      // Validate courseIds exist if provided
      if (userData.courseIds && userData.courseIds.length > 0) {
        for (const courseId of userData.courseIds) {
          const courseExists = await CourseModel.exists(courseId);
          if (!courseExists) {
            return ResponseUtil.badRequest(res, `Course with ID ${courseId} not found`);
          }
        }
      }

      const user = await UserModel.create(userData);
      return ResponseUtil.created(res, user, 'User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await UserModel.findById(id!);
      if (!existingUser) {
        return ResponseUtil.notFound(res, 'User');
      }

      const updateData = req.body;

      // Check if email already exists (excluding current user)
      if (updateData.email) {
        const emailExists = await UserModel.emailExists(updateData.email, id);
        if (emailExists) {
          return ResponseUtil.conflict(res, 'Email already exists');
        }
      }

      // Validate courseIds exist if provided
      if (updateData.courseIds && updateData.courseIds.length > 0) {
        for (const courseId of updateData.courseIds) {
          const courseExists = await CourseModel.exists(courseId);
          if (!courseExists) {
            return ResponseUtil.badRequest(res, `Course with ID ${courseId} not found`);
          }
        }
      }

      // Validate role and courseIds relationship
      const finalRole = updateData.role || existingUser.role;
      if (finalRole === 'student' && (!updateData.courseIds || updateData.courseIds.length === 0)) {
        return ResponseUtil.badRequest(res, 'Students must be assigned to at least one course');
      }

      const user = await UserModel.update(id!, updateData);
      return ResponseUtil.success(res, user, 'User updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const userExists = await UserModel.exists(id!);
      if (!userExists) {
        return ResponseUtil.notFound(res, 'User');
      }

      const deleted = await UserModel.delete(id!);
      if (!deleted) {
        return ResponseUtil.internalError(res, 'Failed to delete user');
      }

      return ResponseUtil.success(res, { id }, 'User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getByRole(req: Request, res: Response): Promise<Response> {
    try {
      const { role } = req.params;
      
      if (!['student', 'teacher', 'coordinator', 'admin'].includes(role!)) {
        return ResponseUtil.badRequest(res, 'Invalid role');
      }

      const users = await UserModel.findByRole(role as any);
      return ResponseUtil.success(res, users, `${role}s retrieved successfully`);
    } catch (error: any) {
      console.error('Error fetching users by role:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
