// Entity classes are now imported from ../entities
// These interfaces have been replaced by classes that handle field mapping automatically
import { User as UserEntity } from '../entities/User';
import { Enrollment as EnrollmentEntity } from '../entities/Enrollment';

export { User } from '../entities/User';
export { Course } from '../entities/Course';
export { UserCourse } from '../entities/UserCourse';
export { Semester } from '../entities/Semester';
export { Subject } from '../entities/Subject';
export { Enrollment } from '../entities/Enrollment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserEntity['role'];
  courseIds?: string[];
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

export interface CreateCourseRequest {
  name: string;
  code: string;
  description?: string;
  coordinatorId?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CreateSemesterRequest {
  code: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSemesterRequest extends Partial<CreateSemesterRequest> {}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  credits: number;
  courseId: string;
  semesterId: string;
  teacherId?: string;
}

export interface UpdateSubjectRequest extends Partial<CreateSubjectRequest> {}

export interface CreateEnrollmentRequest {
  studentId: string;
  subjectId: string;
  status?: EnrollmentEntity['status'];
}

export interface UpdateEnrollmentRequest extends Partial<CreateEnrollmentRequest> {}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}
