import { Request, Response } from 'express';
import { EnrollmentModel } from '../models/Enrollment';
import { UserModel } from '../models/User';
import { SubjectModel } from '../models/Subject';
import { ResponseUtil } from '../utils/response';
import { createEnrollmentSchema, updateEnrollmentSchema } from '../utils/validation';

export class EnrollmentController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const enrollments = await EnrollmentModel.findWithDetails();
      return ResponseUtil.success(res, enrollments, 'Enrollments retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching enrollments:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const enrollment = await EnrollmentModel.findById(id!);
      
      if (!enrollment) {
        return ResponseUtil.notFound(res, 'Enrollment');
      }
      
      return ResponseUtil.success(res, enrollment, 'Enrollment retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching enrollment:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const { error, value } = createEnrollmentSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Validate student exists and has correct role
      const student = await UserModel.findById(value.studentId);
      if (!student) {
        return ResponseUtil.badRequest(res, 'Student not found');
      }
      if (student.role !== 'student') {
        return ResponseUtil.badRequest(res, 'User must have student role');
      }

      // Validate subject exists
      const subjectExists = await SubjectModel.exists(value.subjectId);
      if (!subjectExists) {
        return ResponseUtil.badRequest(res, 'Subject not found');
      }

      // Check if enrollment already exists
      const enrollmentExists = await EnrollmentModel.enrollmentExists(value.studentId, value.subjectId);
      if (enrollmentExists) {
        return ResponseUtil.conflict(res, 'Student is already enrolled in this subject');
      }

      const enrollment = await EnrollmentModel.create(value);
      return ResponseUtil.created(res, enrollment, 'Enrollment created successfully');
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateEnrollmentSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Check if enrollment exists
      const existingEnrollment = await EnrollmentModel.findById(id!);
      if (!existingEnrollment) {
        return ResponseUtil.notFound(res, 'Enrollment');
      }

      // Validate student exists and has correct role if provided
      if (value.studentId) {
        const student = await UserModel.findById(value.studentId);
        if (!student) {
          return ResponseUtil.badRequest(res, 'Student not found');
        }
        if (student.role !== 'student') {
          return ResponseUtil.badRequest(res, 'User must have student role');
        }
      }

      // Validate subject exists if provided
      if (value.subjectId) {
        const subjectExists = await SubjectModel.exists(value.subjectId);
        if (!subjectExists) {
          return ResponseUtil.badRequest(res, 'Subject not found');
        }
      }

      // Check if enrollment already exists (excluding current enrollment)
      if (value.studentId && value.subjectId) {
        const enrollmentExists = await EnrollmentModel.enrollmentExists(value.studentId, value.subjectId, id);
        if (enrollmentExists) {
          return ResponseUtil.conflict(res, 'Student is already enrolled in this subject');
        }
      }

      const enrollment = await EnrollmentModel.update(id!, value);
      return ResponseUtil.success(res, enrollment, 'Enrollment updated successfully');
    } catch (error: any) {
      console.error('Error updating enrollment:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const enrollmentExists = await EnrollmentModel.exists(id!);
      if (!enrollmentExists) {
        return ResponseUtil.notFound(res, 'Enrollment');
      }

      const deleted = await EnrollmentModel.delete(id!);
      if (!deleted) {
        return ResponseUtil.internalError(res, 'Failed to delete enrollment');
      }

      return ResponseUtil.success(res, { id }, 'Enrollment deleted successfully');
    } catch (error: any) {
      console.error('Error deleting enrollment:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getByStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { status } = req.params;
      
      if (!['active', 'completed', 'dropped'].includes(status!)) {
        return ResponseUtil.badRequest(res, 'Invalid status');
      }

      const enrollments = await EnrollmentModel.findByStatus(status as any);
      return ResponseUtil.success(res, enrollments, `${status} enrollments retrieved successfully`);
    } catch (error: any) {
      console.error('Error fetching enrollments by status:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
