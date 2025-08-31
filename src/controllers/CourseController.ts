import { Request, Response } from 'express';
import { CourseModel } from '../models/Course';
import { UserModel } from '../models/User';
import { SemesterModel } from '../models/Semester';
import { SubjectModel } from '../models/Subject';
import { UserCourseModel } from '../models/UserCourse';
import { ResponseUtil } from '../utils/response';
import { createCourseSchema, updateCourseSchema, createSubjectInCourseSchema } from '../utils/validation';

export class CourseController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const courses = await CourseModel.findWithCoordinator();
      return ResponseUtil.success(res, courses, 'Courses retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id!);
      
      if (!course) {
        return ResponseUtil.notFound(res, 'Course');
      }
      
      // Fetch all semesters (now global) and students for the course
      const [semesters, students] = await Promise.all([
        SemesterModel.findAll(),
        CourseModel.getStudents(id!)
      ]);
      
      // Return course with semesters and students
      const courseWithDetails = {
        ...course,
        semesters,
        students
      };
      
      return ResponseUtil.success(res, courseWithDetails, 'Course retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching course:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const { error, value } = createCourseSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Check if code already exists
      const existingCourse = await CourseModel.findByCode(value.code);
      if (existingCourse) {
        return ResponseUtil.conflict(res, 'Course code already exists');
      }

      // Validate coordinator exists and has correct role
      if (value.coordinatorId) {
        const coordinator = await UserModel.findById(value.coordinatorId);
        if (!coordinator) {
          return ResponseUtil.badRequest(res, 'Coordinator not found');
        }
        if (coordinator.role !== 'coordinator') {
          return ResponseUtil.badRequest(res, 'User must have coordinator role');
        }
      }

      const course = await CourseModel.create(value);
      return ResponseUtil.created(res, course, 'Course created successfully');
    } catch (error: any) {
      console.error('Error creating course:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateCourseSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Check if course exists
      const existingCourse = await CourseModel.findById(id!);
      if (!existingCourse) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Check if code already exists (excluding current course)
      if (value.code) {
        const codeExists = await CourseModel.codeExists(value.code, id);
        if (codeExists) {
          return ResponseUtil.conflict(res, 'Course code already exists');
        }
      }

      // Validate coordinator exists and has correct role
      if (value.coordinatorId) {
        const coordinator = await UserModel.findById(value.coordinatorId);
        if (!coordinator) {
          return ResponseUtil.badRequest(res, 'Coordinator not found');
        }
        if (coordinator.role !== 'coordinator') {
          return ResponseUtil.badRequest(res, 'User must have coordinator role');
        }
      }

      const course = await CourseModel.update(id!, value);
      return ResponseUtil.success(res, course, 'Course updated successfully');
    } catch (error: any) {
      console.error('Error updating course:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const courseExists = await CourseModel.exists(id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      const deleted = await CourseModel.delete(id!);
      if (!deleted) {
        return ResponseUtil.internalError(res, 'Failed to delete course');
      }

      return ResponseUtil.success(res, { id }, 'Course deleted successfully');
    } catch (error: any) {
      console.error('Error deleting course:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getSemesters(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const courseExists = await CourseModel.exists(id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Since semesters are now global, return all semesters
      // You might want to filter by subjects that belong to this course
      const semesters = await SemesterModel.findAll();
      return ResponseUtil.success(res, semesters, 'Semesters retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching semesters:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getStudents(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const courseExists = await CourseModel.exists(id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      const students = await CourseModel.getStudents(id!);
      return ResponseUtil.success(res, students, 'Course students retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching course students:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getTeachers(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const courseExists = await CourseModel.exists(id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      const teachers = await CourseModel.getTeachers(id!);
      return ResponseUtil.success(res, teachers, 'Course teachers retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching course teachers:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async getSubjects(req: Request, res: Response): Promise<Response> {
    try {
      const { id, semesterId } = req.params;

      // Validate course exists
      const courseExists = await CourseModel.exists(id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Validate semester exists
      const semesterExists = await SemesterModel.exists(semesterId!);
      if (!semesterExists) {
        return ResponseUtil.notFound(res, 'Semester');
      }

      // Get subjects with details for the specific course and semester
      const subjects = await SubjectModel.findByCourseAndSemesterWithDetails(id!, semesterId!);

      return ResponseUtil.success(res, subjects, 'Course subjects retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching course subjects:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async createSubject(req: Request, res: Response): Promise<Response> {
    try {
      const { id: courseId } = req.params;

      // Validate input
      const { error, value } = createSubjectInCourseSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Validate course exists
      const courseExists = await CourseModel.exists(courseId!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Validate semester exists
      const semesterExists = await SemesterModel.exists(value.semesterId);
      if (!semesterExists) {
        return ResponseUtil.badRequest(res, 'Semester not found');
      }

      // Check if subject code already exists in the course and semester
      const codeExists = await SubjectModel.codeExistsInCourseAndSemester(value.code, courseId!, value.semesterId);
      if (codeExists) {
        return ResponseUtil.conflict(res, 'Subject code already exists in this course and semester');
      }

              // Validate teacher exists and has correct role
        if (value.teacherId) {
          const teacher = await UserModel.findById(value.teacherId);
          if (!teacher) {
            return ResponseUtil.badRequest(res, 'Teacher not found');
          }
          if (teacher.role !== 'teacher') {
            return ResponseUtil.badRequest(res, 'User must have teacher role');
          }

          // Validate that teacher is assigned to this course
          const teacherInCourse = await UserCourseModel.exists(value.teacherId, courseId!);
          if (!teacherInCourse) {
            return ResponseUtil.badRequest(res, 'Teacher must be assigned to this course');
          }
        }

      // Create subject with courseId from URL params
      const subjectData = {
        ...value,
        courseId: courseId!
      };

      const subject = await SubjectModel.create(subjectData);
      return ResponseUtil.created(res, subject, 'Subject created successfully');
    } catch (error: any) {
      console.error('Error creating subject:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
