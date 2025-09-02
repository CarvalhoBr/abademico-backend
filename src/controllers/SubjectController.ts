import { Request, Response } from 'express';
import { SubjectModel } from '../models/Subject';
import { SemesterModel } from '../models/Semester';
import { CourseModel } from '../models/Course';
import { UserModel } from '../models/User';
import { ResponseUtil } from '../utils/response';
import { updateSubjectSchema } from '../utils/validation';

export class SubjectController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const subjects = await SubjectModel.findWithDetails();
      return ResponseUtil.success(res, subjects, 'Subjects retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findById(id!);
      
      if (!subject) {
        return ResponseUtil.notFound(res, 'Subject');
      }
      
      return ResponseUtil.success(res, subject, 'Subject retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching subject:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }



  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateSubjectSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Check if subject exists
      const existingSubject = await SubjectModel.findById(id!);
      if (!existingSubject) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      // Validate course exists if provided
      if (value.course_id) {
        const courseExists = await CourseModel.exists(value.course_id);
        if (!courseExists) {
          return ResponseUtil.badRequest(res, 'Course not found');
        }
      }

      // Validate semester exists if provided
      if (value.semester_id) {
        const semesterExists = await SemesterModel.exists(value.semester_id);
        if (!semesterExists) {
          return ResponseUtil.badRequest(res, 'Semester not found');
        }
      }

      // Check if subject code already exists in the course and semester (excluding current subject)
      if (value.code && value.course_id && value.semester_id) {
        const codeExists = await SubjectModel.codeExistsInCourseAndSemester(value.code, value.course_id, value.semester_id, id);
        if (codeExists) {
          return ResponseUtil.conflict(res, 'Subject code already exists in this course and semester');
        }
      } else if (value.code && (value.course_id || value.semester_id)) {
        // If only one of course_id or semester_id is provided, we need to get the existing values
        const course_id = value.course_id || existingSubject.course_id;
        const semester_id = value.semester_id || existingSubject.semester_id;
        
        const codeExists = await SubjectModel.codeExistsInCourseAndSemester(value.code, course_id, semester_id, id);
        if (codeExists) {
          return ResponseUtil.conflict(res, 'Subject code already exists in this course and semester');
        }
      }

      // Validate teacher exists and has correct role
      if (value.teacher_id) {
        const teacher = await UserModel.findById(value.teacher_id);
        if (!teacher) {
          return ResponseUtil.badRequest(res, 'Teacher not found');
        }
        if (teacher.role !== 'teacher') {
          return ResponseUtil.badRequest(res, 'User must have teacher role');
        }
      }

      const subject = await SubjectModel.update(id!, value);
      return ResponseUtil.success(res, subject, 'Subject updated successfully');
    } catch (error: any) {
      console.error('Error updating subject:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const subjectExists = await SubjectModel.exists(id!);
      if (!subjectExists) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      const deleted = await SubjectModel.delete(id!);
      if (!deleted) {
        return ResponseUtil.internalError(res, 'Failed to delete subject');
      }

      return ResponseUtil.success(res, { id }, 'Subject deleted successfully');
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getEnrollments(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const subjectExists = await SubjectModel.exists(id!);
      if (!subjectExists) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      const enrollments = await SubjectModel.getEnrollments(id!);
      return ResponseUtil.success(res, enrollments, 'Subject enrollments retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching subject enrollments:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async enroll(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { student_id } = req.body;

      if (!student_id) {
        return ResponseUtil.badRequest(res, 'Student ID is required');
      }

      // Validate subject exists
      const subjectExists = await SubjectModel.exists(id!);
      if (!subjectExists) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      // Validate student exists and has correct role
      const student = await UserModel.findById(student_id);
      if (!student) {
        return ResponseUtil.badRequest(res, 'Student not found');
      }
      if (student.role !== 'student') {
        return ResponseUtil.badRequest(res, 'User must have student role');
      }

      const enrollment = await SubjectModel.enrollStudent(id!, student_id);
      return ResponseUtil.created(res, enrollment, 'Student enrolled successfully');
    } catch (error: any) {
      console.error('Error enrolling student:', error);
      if (error.code === '23505') { // Unique constraint violation
        return ResponseUtil.conflict(res, 'Student is already enrolled in this subject');
      }
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async unenroll(req: Request, res: Response): Promise<Response> {
    try {
      const { subject_id, student_id } = req.params;

      // Validate subject exists
      const subjectExists = await SubjectModel.exists(subject_id!);
      if (!subjectExists) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      // Validate student exists
      const studentExists = await UserModel.exists(student_id!);
      if (!studentExists) {
        return ResponseUtil.notFound(res, 'Student');
      }

      const unenrolled = await SubjectModel.unenrollStudent(subject_id!, student_id!);
      if (!unenrolled) {
        return ResponseUtil.notFound(res, 'Enrollment');
      }

      return ResponseUtil.success(res, { subject_id, student_id }, 'Student unenrolled successfully');
    } catch (error: any) {
      console.error('Error unenrolling student:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
