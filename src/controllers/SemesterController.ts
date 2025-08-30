import { Request, Response } from 'express';
import { SemesterModel } from '../models/Semester';
import { CourseModel } from '../models/Course';
import { ResponseUtil } from '../utils/response';
import { createSemesterSchema, updateSemesterSchema } from '../utils/validation';

export class SemesterController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const semesters = await SemesterModel.findAll();
      return ResponseUtil.success(res, semesters, 'Semesters retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching semesters:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const semester = await SemesterModel.findById(id!);
      
      if (!semester) {
        return ResponseUtil.notFound(res, 'Semester');
      }
      
      return ResponseUtil.success(res, semester, 'Semester retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching semester:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const { error, value } = createSemesterSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Check if semester code already exists (semesters are now global)
      const codeExists = await SemesterModel.codeExists(value.code);
      if (codeExists) {
        return ResponseUtil.conflict(res, 'Semester code already exists');
      }

      // Validate date range
      const validDates = await SemesterModel.validateDateRange(value.startDate, value.endDate);
      if (!validDates) {
        return ResponseUtil.badRequest(res, 'Start date must be before end date');
      }

      const semester = await SemesterModel.create(value);
      return ResponseUtil.created(res, semester, 'Semester created successfully');
    } catch (error: any) {
      console.error('Error creating semester:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateSemesterSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Check if semester exists
      const existingSemester = await SemesterModel.findById(id!);
      if (!existingSemester) {
        return ResponseUtil.notFound(res, 'Semester');
      }

      // Check if semester code already exists (excluding current semester)
      if (value.code) {
        const codeExists = await SemesterModel.codeExists(value.code, id);
        if (codeExists) {
          return ResponseUtil.conflict(res, 'Semester code already exists');
        }
      }

      // Validate date range if both dates are provided
      if (value.startDate && value.endDate) {
        const validDates = await SemesterModel.validateDateRange(value.startDate, value.endDate);
        if (!validDates) {
          return ResponseUtil.badRequest(res, 'Start date must be before end date');
        }
      }

      const semester = await SemesterModel.update(id!, value);
      return ResponseUtil.success(res, semester, 'Semester updated successfully');
    } catch (error: any) {
      console.error('Error updating semester:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const semesterExists = await SemesterModel.exists(id!);
      if (!semesterExists) {
        return ResponseUtil.notFound(res, 'Semester');
      }

      const deleted = await SemesterModel.delete(id!);
      if (!deleted) {
        return ResponseUtil.internalError(res, 'Failed to delete semester');
      }

      return ResponseUtil.success(res, { id }, 'Semester deleted successfully');
    } catch (error: any) {
      console.error('Error deleting semester:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getSubjects(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const semesterExists = await SemesterModel.exists(id!);
      if (!semesterExists) {
        return ResponseUtil.notFound(res, 'Semester');
      }

      const subjects = await SemesterModel.getSubjects(id!);
      return ResponseUtil.success(res, subjects, 'Semester subjects retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching semester subjects:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
