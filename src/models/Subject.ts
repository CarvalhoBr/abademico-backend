import db from '../config/database';
import { CreateSubjectRequest, UpdateSubjectRequest } from '../types';
import { Subject } from '../entities';

export class SubjectModel {
  static async findAll(): Promise<Subject[]> {
    const results = await db('subjects')
      .select('*')
      .orderBy('created_at', 'desc');
    return Subject.fromArray(results);
  }

  static async findById(id: string): Promise<Subject | undefined> {
    const result = await db('subjects')
      .where({ id })
      .first();
    return result ? new Subject(result) : undefined;
  }

  static async findBySemesterId(semesterId: string): Promise<Subject[]> {
    const results = await db('subjects')
      .where({ semester_id: semesterId })
      .orderBy('name');
    return Subject.fromArray(results);
  }

  static async findByTeacherId(teacherId: string): Promise<Subject[]> {
    const results = await db('subjects')
      .where({ teacher_id: teacherId })
      .orderBy('name');
    return Subject.fromArray(results);
  }

  static async findByCourseId(courseId: string): Promise<Subject[]> {
    const results = await db('subjects')
      .where({ course_id: courseId })
      .orderBy('name');
    return Subject.fromArray(results);
  }

  static async findByCourseAndSemester(courseId: string, semesterId: string): Promise<Subject[]> {
    const results = await db('subjects')
      .where({ 
        course_id: courseId,
        semester_id: semesterId 
      })
      .orderBy('name');
    return Subject.fromArray(results);
  }

  static async findByCourseAndSemesterWithDetails(courseId: string, semesterId: string): Promise<any[]> {
    return await db('subjects')
      .leftJoin('users', 'subjects.teacher_id', 'users.id')
      .join('semesters', 'subjects.semester_id', 'semesters.id')
      .join('courses', 'subjects.course_id', 'courses.id')
      .where({ 
        'subjects.course_id': courseId,
        'subjects.semester_id': semesterId 
      })
      .select(
        'subjects.*',
        'users.name as teacher_name',
        'users.email as teacher_email',
        'semesters.code as semester_code',
        'courses.name as course_name',
        'courses.code as course_code'
      )
      .orderBy('subjects.name');
  }

  static async findWithDetails(): Promise<any[]> {
    return await db('subjects')
      .leftJoin('users', 'subjects.teacher_id', 'users.id')
      .join('semesters', 'subjects.semester_id', 'semesters.id')
      .join('courses', 'subjects.course_id', 'courses.id')
      .select(
        'subjects.*',
        'users.name as teacher_name',
        'users.email as teacher_email',
        'semesters.code as semester_code',
        'courses.name as course_name',
        'courses.code as course_code'
      )
      .orderBy('subjects.created_at', 'desc');
  }

  static async create(data: CreateSubjectRequest): Promise<Subject> {
    const [result] = await db('subjects')
      .insert({
        name: data.name,
        code: data.code,
        credits: data.credits,
        course_id: data.courseId,
        semester_id: data.semesterId,
        teacher_id: data.teacherId || null
      })
      .returning('*');
    
    return new Subject(result);
  }

  static async update(id: string, data: UpdateSubjectRequest): Promise<Subject | undefined> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.credits !== undefined) updateData.credits = data.credits;
    if (data.courseId !== undefined) updateData.course_id = data.courseId;
    if (data.semesterId !== undefined) updateData.semester_id = data.semesterId;
    if (data.teacherId !== undefined) updateData.teacher_id = data.teacherId;
    
    updateData.updated_at = new Date();

    const [result] = await db('subjects')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return result ? new Subject(result) : undefined;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('subjects')
      .where({ id })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(id: string): Promise<boolean> {
    const subject = await db('subjects')
      .where({ id })
      .first();
    
    return !!subject;
  }

  static async codeExistsInCourseAndSemester(code: string, courseId: string, semesterId: string, excludeId?: string): Promise<boolean> {
    let query = db('subjects')
      .where({ 
        code,
        course_id: courseId,
        semester_id: semesterId
      });
    
    if (excludeId) {
      query = query.andWhere('id', '!=', excludeId);
    }
    
    const subject = await query.first();
    return !!subject;
  }

  static async getEnrollments(subjectId: string): Promise<any[]> {
    return await db('enrollments')
      .join('users', 'enrollments.student_id', 'users.id')
      .where({ subject_id: subjectId })
      .select(
        'enrollments.*',
        'users.name as student_name',
        'users.email as student_email'
      )
      .orderBy('enrollments.enrollment_date', 'desc');
  }

  static async enrollStudent(subjectId: string, studentId: string): Promise<any> {
    const [result] = await db('enrollments')
      .insert({
        subject_id: subjectId,
        student_id: studentId,
        status: 'active'
      })
      .returning('*');
    
    return result;
  }

  static async unenrollStudent(subjectId: string, studentId: string): Promise<boolean> {
    const deletedRows = await db('enrollments')
      .where({ 
        subject_id: subjectId,
        student_id: studentId
      })
      .del();
    
    return deletedRows > 0;
  }
}
