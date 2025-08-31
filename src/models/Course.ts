import db from '../config/database';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';
import { UserCourseModel } from './UserCourse';

export class CourseModel {
  static async findAll(): Promise<Course[]> {
    return await db('courses')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  static async findById(id: string): Promise<Course | undefined> {
    return await db('courses')
      .where({ id })
      .first();
  }

  static async findByCode(code: string): Promise<Course | undefined> {
    return await db('courses')
      .where({ code })
      .first();
  }

  static async findWithCoordinator(): Promise<any[]> {
    return await db('courses')
      .leftJoin('users', 'courses.coordinator_id', 'users.id')
      .select(
        'courses.*',
        'users.name as coordinator_name',
        'users.email as coordinator_email'
      )
      .orderBy('courses.created_at', 'desc');
  }

  static async create(data: CreateCourseRequest): Promise<Course> {
    const [course] = await db('courses')
      .insert({
        name: data.name,
        code: data.code,
        description: data.description || null,
        coordinator_id: data.coordinatorId || null
      })
      .returning('*');
    
    return course;
  }

  static async update(id: string, data: UpdateCourseRequest): Promise<Course | undefined> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.coordinatorId !== undefined) updateData.coordinator_id = data.coordinatorId;
    
    updateData.updated_at = new Date();

    const [course] = await db('courses')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return course;
  }

  static async delete(id: string): Promise<boolean> {
    // Delete user-course relationships first
    await UserCourseModel.deleteByCourseId(id);
    
    const deletedRows = await db('courses')
      .where({ id })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(id: string): Promise<boolean> {
    const course = await db('courses')
      .where({ id })
      .first();
    
    return !!course;
  }

  static async codeExists(code: string, excludeId?: string): Promise<boolean> {
    let query = db('courses').where({ code });
    
    if (excludeId) {
      query = query.andWhere('id', '!=', excludeId);
    }
    
    const course = await query.first();
    return !!course;
  }

  static async getStudents(courseId: string): Promise<any[]> {
    return await db('users')
      .join('user_courses', 'users.id', 'user_courses.user_id')
      .where({ 
        'user_courses.course_id': courseId,
        'users.role': 'student'
      })
      .select('users.*')
      .orderBy('users.name');
  }

  static async getTeachers(courseId: string): Promise<any[]> {
    return await db('users')
      .join('user_courses', 'users.id', 'user_courses.user_id')
      .where({ 
        'user_courses.course_id': courseId,
        'users.role': 'teacher'
      })
      .select('users.*')
      .orderBy('users.name');
  }
}
