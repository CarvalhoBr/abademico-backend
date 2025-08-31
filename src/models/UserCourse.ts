import db from '../config/database';
import { UserCourse } from '../types';

export class UserCourseModel {
  static async create(userId: string, courseId: string): Promise<UserCourse> {
    const [userCourse] = await db('user_courses')
      .insert({
        user_id: userId,
        course_id: courseId
      })
      .returning('*');
    
    return userCourse;
  }

  static async createMany(userId: string, courseIds: string[]): Promise<UserCourse[]> {
    const userCourses = courseIds.map(courseId => ({
      user_id: userId,
      course_id: courseId
    }));

    return await db('user_courses')
      .insert(userCourses)
      .returning('*');
  }

  static async findByUserId(userId: string): Promise<UserCourse[]> {
    return await db('user_courses')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
  }

  static async findByCourseId(courseId: string): Promise<UserCourse[]> {
    return await db('user_courses')
      .where({ course_id: courseId })
      .orderBy('created_at', 'desc');
  }

  static async findByUserAndCourse(userId: string, courseId: string): Promise<UserCourse | undefined> {
    return await db('user_courses')
      .where({ 
        user_id: userId,
        course_id: courseId
      })
      .first();
  }

  static async deleteByUserAndCourse(userId: string, courseId: string): Promise<boolean> {
    const deletedRows = await db('user_courses')
      .where({ 
        user_id: userId,
        course_id: courseId
      })
      .del();
    
    return deletedRows > 0;
  }

  static async deleteByUserId(userId: string): Promise<boolean> {
    const deletedRows = await db('user_courses')
      .where({ user_id: userId })
      .del();
    
    return deletedRows > 0;
  }

  static async deleteByCourseId(courseId: string): Promise<boolean> {
    const deletedRows = await db('user_courses')
      .where({ course_id: courseId })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(userId: string, courseId: string): Promise<boolean> {
    const userCourse = await db('user_courses')
      .where({ 
        user_id: userId,
        course_id: courseId
      })
      .first();
    
    return !!userCourse;
  }
}
