import db from '../config/database';
import { CreateSemesterRequest, UpdateSemesterRequest } from '../types';
import { Semester } from '../entities';

export class SemesterModel {
  static async findAll(): Promise<Semester[]> {
    const results = await db('semesters')
      .select('*')
      .orderBy('start_date', 'desc');
    return Semester.fromArray(results);
  }

  static async findById(id: string): Promise<Semester | undefined> {
    const result = await db('semesters')
      .where({ id })
      .first();
    return result ? new Semester(result) : undefined;
  }

  static async create(data: CreateSemesterRequest): Promise<Semester> {
    const [result] = await db('semesters')
      .insert({
        code: data.code,
        start_date: data.startDate,
        end_date: data.endDate
      })
      .returning('*');
    
    return new Semester(result);
  }

  static async update(id: string, data: UpdateSemesterRequest): Promise<Semester | undefined> {
    const updateData: any = {};
    
    if (data.code !== undefined) updateData.code = data.code;
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.endDate !== undefined) updateData.end_date = data.endDate;
    
    updateData.updated_at = new Date();

    const [result] = await db('semesters')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return result ? new Semester(result) : undefined;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('semesters')
      .where({ id })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(id: string): Promise<boolean> {
    const semester = await db('semesters')
      .where({ id })
      .first();
    
    return !!semester;
  }

  static async codeExists(code: string, excludeId?: string): Promise<boolean> {
    let query = db('semesters')
      .where({ code });
    
    if (excludeId) {
      query = query.andWhere('id', '!=', excludeId);
    }
    
    const semester = await query.first();
    return !!semester;
  }

  static async getSubjects(semesterId: string, courseId?: string): Promise<any[]> {
    let query = db('subjects')
      .leftJoin('users', 'subjects.teacher_id', 'users.id')
      .leftJoin('courses', 'subjects.course_id', 'courses.id')
      .where({ semester_id: semesterId });
    
    if (courseId) {
      query = query.andWhere({ course_id: courseId });
    }
    
    return await query
      .select(
        'subjects.*',
        'users.name as teacher_name',
        'users.email as teacher_email',
        'courses.name as course_name',
        'courses.code as course_code'
      )
      .orderBy('subjects.name');
  }

  static async validateDateRange(startDate: string, endDate: string): Promise<boolean> {
    return new Date(startDate) < new Date(endDate);
  }
}
