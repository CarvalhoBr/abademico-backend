import Joi from 'joi';

// User validation schemas
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('student', 'teacher', 'coordinator', 'admin').required(),
  courseId: Joi.string().uuid().optional()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('student', 'teacher', 'coordinator', 'admin').optional(),
  courseId: Joi.string().uuid().allow(null).optional()
});

// Course validation schemas
export const createCourseSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  code: Joi.string().min(2).max(10).alphanum().required(),
  description: Joi.string().max(500).optional(),
  coordinatorId: Joi.string().uuid().optional()
});

export const updateCourseSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  code: Joi.string().min(2).max(10).alphanum().optional(),
  description: Joi.string().max(500).allow(null).optional(),
  coordinatorId: Joi.string().uuid().allow(null).optional()
});

// Semester validation schemas
export const createSemesterSchema = Joi.object({
  code: Joi.string().pattern(/^\d{4}-\d{2}$/).required(), // Format: YYYY-SS
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
});

export const updateSemesterSchema = Joi.object({
  code: Joi.string().pattern(/^\d{4}-\d{2}$/).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && new Date(value.startDate) >= new Date(value.endDate)) {
    return helpers.error('any.invalid', { message: 'End date must be after start date' });
  }
  return value;
});

// Subject validation schemas
export const createSubjectSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  code: Joi.string().min(2).max(20).alphanum().required(),
  credits: Joi.number().integer().min(1).max(10).required(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
  teacherId: Joi.string().uuid().optional()
});

export const updateSubjectSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  code: Joi.string().min(2).max(20).alphanum().optional(),
  credits: Joi.number().integer().min(1).max(10).optional(),
  courseId: Joi.string().uuid().optional(),
  semesterId: Joi.string().uuid().optional(),
  teacherId: Joi.string().uuid().allow(null).optional()
});

// Enrollment validation schemas
export const createEnrollmentSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  subjectId: Joi.string().uuid().required(),
  status: Joi.string().valid('active', 'completed', 'dropped').optional()
});

export const updateEnrollmentSchema = Joi.object({
  studentId: Joi.string().uuid().optional(),
  subjectId: Joi.string().uuid().optional(),
  status: Joi.string().valid('active', 'completed', 'dropped').optional()
});

// Query params validation
export const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc')
});

// UUID validation
export const uuidSchema = Joi.string().uuid().required();
