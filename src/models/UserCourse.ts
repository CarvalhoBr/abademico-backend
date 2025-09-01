import db from '../config/database';
import { UserCourse } from '../entities';

export class UserCourseModel {
  static async create(userId: string, courseId: string): Promise<UserCourse> {
    const [result] = await db('user_courses')
      .insert({
        user_id: userId,
        course_id: courseId
      })
      .returning('*');
    
    return new UserCourse(result);
  }

  static async createMany(userId: string, courseIds: string[]): Promise<UserCourse[]> {
    const userCourses = courseIds.map(courseId => ({
      user_id: userId,
      course_id: courseId
    }));

    const results = await db('user_courses')
      .insert(userCourses)
      .returning('*');
    
    return UserCourse.fromArray(results);
  }

  static async findByUserId(userId: string): Promise<UserCourse[]> {
    const results = await db('user_courses')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
    return UserCourse.fromArray(results);
  }

  static async findByCourseId(courseId: string): Promise<UserCourse[]> {
    const results = await db('user_courses')
      .where({ course_id: courseId })
      .orderBy('created_at', 'desc');
    return UserCourse.fromArray(results);
  }

  static async findByUserAndCourse(userId: string, courseId: string): Promise<UserCourse | undefined> {
    const result = await db('user_courses')
      .where({ 
        user_id: userId,
        course_id: courseId
      })
      .first();
    return result ? new UserCourse(result) : undefined;
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
