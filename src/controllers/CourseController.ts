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
      const value = req.body

      // Check if code already exists
      const existingCourse = await CourseModel.findByCode(value.code);
      if (existingCourse) {
        return ResponseUtil.conflict(res, 'Course code already exists');
      }

      // Validate coordinator exists and has correct role
      if (value.coordinator_id) {
        const coordinator = await UserModel.findById(value.coordinator_id);
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
      if (value.coordinator_id) {
        const coordinator = await UserModel.findById(value.coordinator_id);
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
      const { id, semester_id } = req.params;
      const user = (req as any).user; // Get user from auth middleware
      
      if (!user) {
        return ResponseUtil.error(res, 'UNAUTHORIZED', 'User not authenticated', 401);
      }

      // Extract user_id from authenticated user (may be undefined for some user types)
      const user_id = user.id;

      // Validate course exists
      const courseExists = await CourseModel.exists(id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Validate semester exists
      const semesterExists = await SemesterModel.exists(semester_id!);
      if (!semesterExists) {
        return ResponseUtil.notFound(res, 'Semester');
      }

      // Get subjects with details and enrollment status for the specific course and semester
      // If user_id exists and user is a student, check enrollment status; otherwise, enrolled will be false
      const shouldCheckEnrollment = user_id && user.role === 'student';
      const subjects = await SubjectModel.findByCourseAndSemesterWithEnrollmentStatus(
        id!, 
        semester_id!, 
        shouldCheckEnrollment ? user_id : undefined
      );

      return ResponseUtil.success(res, subjects, 'Course subjects retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching course subjects:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async createSubject(req: Request, res: Response): Promise<Response> {
    try {
      const { id: course_id } = req.params;

      // Validate input
      const { error, value } = createSubjectInCourseSchema.validate(req.body);
      if (error) {
        return ResponseUtil.validationError(res, error.details);
      }

      // Validate course exists
      const courseExists = await CourseModel.exists(course_id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Validate semester exists
      const semesterExists = await SemesterModel.exists(value.semester_id);
      if (!semesterExists) {
        return ResponseUtil.badRequest(res, 'Semester not found');
      }

      // Check if subject code already exists in the course and semester
      const codeExists = await SubjectModel.codeExistsInCourseAndSemester(value.code, course_id!, value.semester_id);
      if (codeExists) {
        return ResponseUtil.conflict(res, 'Subject code already exists in this course and semester');
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

          // Validate that teacher is assigned to this course
          const teacherInCourse = await UserCourseModel.exists(value.teacher_id, course_id!);
          if (!teacherInCourse) {
            return ResponseUtil.badRequest(res, 'Teacher must be assigned to this course');
          }
        }

      // Create subject with course_id from URL params
      const subjectData = {
        ...value,
        course_id: course_id!
      };

      const subject = await SubjectModel.create(subjectData);
      return ResponseUtil.created(res, subject, 'Subject created successfully');
    } catch (error: any) {
      console.error('Error creating subject:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async enrollInSubject(req: Request, res: Response): Promise<Response> {
    try {
      const { course_id, subject_id, user_id } = req.params;

      // Validate course exists
      const courseExists = await CourseModel.exists(course_id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Validate subject exists and belongs to the course
      const subject = await SubjectModel.findById(subject_id!);
      if (!subject) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      if (subject.course_id !== course_id) {
        return ResponseUtil.badRequest(res, 'Subject does not belong to this course');
      }

      // Validate user exists and has correct role
      const user = await UserModel.findById(user_id!);
      if (!user) {
        return ResponseUtil.badRequest(res, 'User not found');
      }
      if (user.role !== 'student') {
        return ResponseUtil.badRequest(res, 'User must have student role');
      }

      // Validate that user is enrolled in this course
      const userInCourse = await UserCourseModel.exists(user_id!, course_id!);
      if (!userInCourse) {
        return ResponseUtil.badRequest(res, 'User must be enrolled in this course');
      }

      const enrollment = await SubjectModel.enrollStudent(subject_id!, user_id!);
      return ResponseUtil.created(res, enrollment, 'Student enrolled successfully');
    } catch (error: any) {
      console.error('Error enrolling student:', error);
      if (error.code === '23505') { // Unique constraint violation
        return ResponseUtil.conflict(res, 'Student is already enrolled in this subject');
      }
      return ResponseUtil.internalError(res, error.message);
    }
  }

  static async unenrollFromSubject(req: Request, res: Response): Promise<Response> {
    try {
      const { course_id, subject_id, user_id } = req.params;

      // Validate course exists
      const courseExists = await CourseModel.exists(course_id!);
      if (!courseExists) {
        return ResponseUtil.notFound(res, 'Course');
      }

      // Validate subject exists and belongs to the course
      const subject = await SubjectModel.findById(subject_id!);
      if (!subject) {
        return ResponseUtil.notFound(res, 'Subject');
      }

      if (subject.course_id !== course_id) {
        return ResponseUtil.badRequest(res, 'Subject does not belong to this course');
      }

      // Validate user exists
      const userExists = await UserModel.exists(user_id!);
      if (!userExists) {
        return ResponseUtil.notFound(res, 'User');
      }

      const unenrolled = await SubjectModel.unenrollStudent(subject_id!, user_id!);
      if (!unenrolled) {
        return ResponseUtil.notFound(res, 'Enrollment');
      }

      return ResponseUtil.success(res, { course_id, subject_id, user_id }, 'Student unenrolled successfully');
    } catch (error: any) {
      console.error('Error unenrolling student:', error);
      return ResponseUtil.internalError(res, error.message);
    }
  }
}
