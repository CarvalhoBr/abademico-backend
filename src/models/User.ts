import db from '../config/database';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';

export class UserModel {
  static async findAll(): Promise<User[]> {
    return await db('users')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  static async findById(id: string): Promise<User | undefined> {
    return await db('users')
      .where({ id })
      .first();
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return await db('users')
      .where({ email })
      .first();
  }

  static async findByRole(role: User['role']): Promise<User[]> {
    return await db('users')
      .where({ role })
      .orderBy('created_at', 'desc');
  }

  static async findByCourseId(courseId: string): Promise<User[]> {
    return await db('users')
      .where({ course_id: courseId })
      .orderBy('created_at', 'desc');
  }

  static async create(data: CreateUserRequest): Promise<User> {
    const [user] = await db('users')
      .insert({
        name: data.name,
        email: data.email,
        role: data.role,
        course_id: data.courseId || null
      })
      .returning('*');
    
    return user;
  }

  static async update(id: string, data: UpdateUserRequest): Promise<User | undefined> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.courseId !== undefined) updateData.course_id = data.courseId;
    
    updateData.updated_at = new Date();

    const [user] = await db('users')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return user;
  }

  static async delete(id: string): Promise<boolean> {
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
