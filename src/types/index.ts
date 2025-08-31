export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'coordinator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string | null;
  coordinatorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Semester {
  id: string;
  code: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  courseId: string;
  semesterId: string;
  teacherId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  subjectId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'dropped';
  createdAt: Date;
  updatedAt: Date;
}

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
  role: User['role'];
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
  status?: Enrollment['status'];
}

export interface UpdateEnrollmentRequest extends Partial<CreateEnrollmentRequest> {}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}
