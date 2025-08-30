import Joi from 'joi';

// Common schemas
export const uuidSchema = Joi.string().uuid().required();
export const roleSchema = Joi.string().valid('student', 'teacher', 'coordinator', 'admin').required();
export const statusSchema = Joi.string().valid('active', 'completed', 'dropped').required();

// User schemas
export const createUserBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  courseId: Joi.string().uuid().optional()
});

export const updateUserBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  courseId: Joi.string().uuid().allow(null).optional()
});

export const userRoleParamSchema = Joi.object({
  role: roleSchema
});

export const userIdParamSchema = Joi.object({
  id: uuidSchema
});

// Course schemas
export const createCourseBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  code: Joi.string().min(2).max(10).alphanum().required(),
  description: Joi.string().max(500).optional(),
  coordinatorId: Joi.string().uuid().optional()
});

export const updateCourseBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  code: Joi.string().min(2).max(10).alphanum().optional(),
  description: Joi.string().max(500).allow(null).optional(),
  coordinatorId: Joi.string().uuid().allow(null).optional()
});

export const courseIdParamSchema = Joi.object({
  id: uuidSchema
});

// Semester schemas
export const createSemesterBodySchema = Joi.object({
  code: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  courseId: Joi.string().uuid().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
});

export const updateSemesterBodySchema = Joi.object({
  code: Joi.string().pattern(/^\d{4}-\d{2}$/).optional(),
  courseId: Joi.string().uuid().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && new Date(value.startDate) >= new Date(value.endDate)) {
    return helpers.error('any.invalid', { message: 'End date must be after start date' });
  }
  return value;
});

export const semesterIdParamSchema = Joi.object({
  id: uuidSchema
});

// Subject schemas
export const createSubjectBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  code: Joi.string().min(2).max(20).alphanum().required(),
  credits: Joi.number().integer().min(1).max(10).required(),
  semesterId: Joi.string().uuid().required(),
  teacherId: Joi.string().uuid().optional()
});

export const updateSubjectBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  code: Joi.string().min(2).max(20).alphanum().optional(),
  credits: Joi.number().integer().min(1).max(10).optional(),
  semesterId: Joi.string().uuid().optional(),
  teacherId: Joi.string().uuid().allow(null).optional()
});

export const subjectIdParamSchema = Joi.object({
  id: uuidSchema
});

export const subjectEnrollParamsSchema = Joi.object({
  subjectId: uuidSchema,
  studentId: uuidSchema
});

export const enrollStudentBodySchema = Joi.object({
  studentId: Joi.string().uuid().required()
});

// Enrollment schemas
export const createEnrollmentBodySchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  subjectId: Joi.string().uuid().required(),
  status: statusSchema.optional()
});

export const updateEnrollmentBodySchema = Joi.object({
  studentId: Joi.string().uuid().optional(),
  subjectId: Joi.string().uuid().optional(),
  status: statusSchema.optional()
});

export const enrollmentIdParamSchema = Joi.object({
  id: uuidSchema
});

export const enrollmentStatusParamSchema = Joi.object({
  status: statusSchema
});

// Query params schema
export const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc')
});
