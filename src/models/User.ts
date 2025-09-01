import db from '../config/database';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import { User } from '../entities';
import { UserCourseModel } from './UserCourse';

export class UserModel {
  static async findAll(): Promise<User[]> {
    const results = await db('users')
      .select('*')
      .orderBy('created_at', 'desc');
    return User.fromArray(results);
  }

  static async findById(id: string): Promise<User | undefined> {
    const result = await db('users')
      .where({ id })
      .first();
    return result ? new User(result) : undefined;
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    const result = await db('users')
      .where({ email })
      .first();
    return result ? new User(result) : undefined;
  }

  static async findByRole(role: 'student' | 'teacher' | 'coordinator' | 'admin'): Promise<User[]> {
    const results = await db('users')
      .where({ role })
      .orderBy('created_at', 'desc');
    return User.fromArray(results);
  }

  static async getCourses(userId: string): Promise<any[]> {
    return await db('user_courses')
      .join('courses', 'user_courses.course_id', 'courses.id')
      .where('user_courses.user_id', userId)
      .select('courses.*')
      .orderBy('courses.name');
  }

  static async addCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      // Check if relationship already exists
      const exists = await UserCourseModel.exists(userId, courseId);
      if (exists) {
        return true; // Already exists, consider it successful
      }
      
      // Create new relationship
      await UserCourseModel.create(userId, courseId);
      return true;
    } catch (error) {
      console.error('Error adding course to user:', error);
      return false;
    }
  }

  static async removeCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const deleted = await UserCourseModel.deleteByUserAndCourse(userId, courseId);
      return deleted;
    } catch (error) {
      console.error('Error removing course from user:', error);
      return false;
    }
  }

  static async create(data: CreateUserRequest): Promise<User> {
    const [result] = await db('users')
      .insert({
        name: data.name,
        email: data.email,
        role: data.role
      })
      .returning('*');
    
    const user = new User(result);
    
    // Create user-course relationships if courseIds are provided
    if (data.courseIds && data.courseIds.length > 0) {
      await UserCourseModel.createMany(user.id, data.courseIds);
    }
    
    return user;
  }

  static async update(id: string, data: UpdateUserRequest): Promise<User | undefined> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    
    updateData.updated_at = new Date();

    const [result] = await db('users')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    // Update user-course relationships if courseIds are provided
    if (data.courseIds !== undefined) {
      // Delete existing relationships
      await UserCourseModel.deleteByUserId(id);
      
      // Create new relationships
      if (data.courseIds.length > 0) {
        await UserCourseModel.createMany(id, data.courseIds);
      }
    }
    
    return result ? new User(result) : undefined;
  }

  static async delete(id: string): Promise<boolean> {
    // Delete user-course relationships first
    await UserCourseModel.deleteByUserId(id);
    
    const deletedRows = await db('users')
      .where({ id })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(id: string): Promise<boolean> {
    const user = await db('users')
      .where({ id })
      .first();
    
    return !!user;
  }

  static async emailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = db('users').where({ email });
    
    if (excludeId) {
      query = query.andWhere('id', '!=', excludeId);
    }
    
    const user = await query.first();
    return !!user;
  }
}
