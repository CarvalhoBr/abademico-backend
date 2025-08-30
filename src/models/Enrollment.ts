import db from '../config/database';
import { Enrollment, CreateEnrollmentRequest, UpdateEnrollmentRequest } from '../types';

export class EnrollmentModel {
  static async findAll(): Promise<Enrollment[]> {
    return await db('enrollments')
      .select('*')
      .orderBy('enrollment_date', 'desc');
  }

  static async findById(id: string): Promise<Enrollment | undefined> {
    return await db('enrollments')
      .where({ id })
      .first();
  }

  static async findByStudentId(studentId: string): Promise<Enrollment[]> {
    return await db('enrollments')
      .where({ student_id: studentId })
      .orderBy('enrollment_date', 'desc');
  }

  static async findBySubjectId(subjectId: string): Promise<Enrollment[]> {
    return await db('enrollments')
      .where({ subject_id: subjectId })
      .orderBy('enrollment_date', 'desc');
  }

  static async findWithDetails(): Promise<any[]> {
    return await db('enrollments')
      .join('users', 'enrollments.student_id', 'users.id')
      .join('subjects', 'enrollments.subject_id', 'subjects.id')
      .join('semesters', 'subjects.semester_id', 'semesters.id')
      .join('courses', 'semesters.course_id', 'courses.id')
      .select(
        'enrollments.*',
        'users.name as student_name',
        'users.email as student_email',
        'subjects.name as subject_name',
        'subjects.code as subject_code',
        'subjects.credits as subject_credits',
        'semesters.code as semester_code',
        'courses.name as course_name',
        'courses.code as course_code'
      )
      .orderBy('enrollments.enrollment_date', 'desc');
  }

  static async findByStatus(status: Enrollment['status']): Promise<Enrollment[]> {
    return await db('enrollments')
      .where({ status })
      .orderBy('enrollment_date', 'desc');
  }

  static async create(data: CreateEnrollmentRequest): Promise<Enrollment> {
    const [enrollment] = await db('enrollments')
      .insert({
        student_id: data.studentId,
        subject_id: data.subjectId,
        status: data.status || 'active'
      })
      .returning('*');
    
    return enrollment;
  }

  static async update(id: string, data: UpdateEnrollmentRequest): Promise<Enrollment | undefined> {
    const updateData: any = {};
    
    if (data.studentId !== undefined) updateData.student_id = data.studentId;
    if (data.subjectId !== undefined) updateData.subject_id = data.subjectId;
    if (data.status !== undefined) updateData.status = data.status;
    
    updateData.updated_at = new Date();

    const [enrollment] = await db('enrollments')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return enrollment;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('enrollments')
      .where({ id })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(id: string): Promise<boolean> {
    const enrollment = await db('enrollments')
      .where({ id })
      .first();
    
    return !!enrollment;
  }

  static async enrollmentExists(studentId: string, subjectId: string, excludeId?: string): Promise<boolean> {
    let query = db('enrollments')
      .where({ 
        student_id: studentId,
        subject_id: subjectId
      });
    
    if (excludeId) {
      query = query.andWhere('id', '!=', excludeId);
    }
    
    const enrollment = await query.first();
    return !!enrollment;
  }

  static async getStudentEnrollmentsInSemester(studentId: string, semesterId: string): Promise<any[]> {
    return await db('enrollments')
      .join('subjects', 'enrollments.subject_id', 'subjects.id')
      .where({
        'enrollments.student_id': studentId,
        'subjects.semester_id': semesterId
      })
      .select('enrollments.*', 'subjects.name as subject_name', 'subjects.credits')
      .orderBy('enrollments.enrollment_date', 'desc');
  }

  static async getTotalCreditsForStudent(studentId: string, semesterId: string, status: Enrollment['status'] = 'active'): Promise<number> {
    const result = await db('enrollments')
      .join('subjects', 'enrollments.subject_id', 'subjects.id')
      .where({
        'enrollments.student_id': studentId,
        'subjects.semester_id': semesterId,
        'enrollments.status': status
      })
      .sum('subjects.credits as total_credits')
      .first();
    
    return result?.total_credits || 0;
  }
}
