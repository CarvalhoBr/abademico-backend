import Joi from 'joi';

// Common schemas
export const uuidSchema = Joi.string().uuid().required();
export const roleSchema = Joi.string().valid('student', 'teacher', 'coordinator', 'admin').required();
export const statusSchema = Joi.string().valid('active', 'completed', 'dropped').required();

// User schemas
export const createUserBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

export const updateUserBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional()
});



export const addUserCourseBodySchema = Joi.object({
  course_id: Joi.string().uuid().required()
});

export const userCourseParamsSchema = Joi.object({
  id: uuidSchema,
  course_id: uuidSchema
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
  coordinator_id: Joi.string().uuid().optional()
});

export const updateCourseBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  code: Joi.string().min(2).max(10).alphanum().optional(),
  description: Joi.string().max(500).allow(null).optional(),
  coordinator_id: Joi.string().uuid().allow(null).optional()
});

export const courseIdParamSchema = Joi.object({
  id: uuidSchema
});

export const courseSubjectsParamSchema = Joi.object({
  id: uuidSchema,
  semester_id: uuidSchema
});

// Semester schemas
export const createSemesterBodySchema = Joi.object({
  code: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required()
});

export const updateSemesterBodySchema = Joi.object({
  code: Joi.string().pattern(/^\d{4}-\d{2}$/).optional(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional()
}).custom((value, helpers) => {
  if (value.start_date && value.end_date && new Date(value.start_date) >= new Date(value.end_date)) {
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
  course_id: Joi.string().uuid().required(),
  semester_id: Joi.string().uuid().required(),
  teacher_id: Joi.string().uuid().optional()
});

export const createSubjectInCourseBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  code: Joi.string().min(2).max(20).alphanum().required(),
  credits: Joi.number().integer().min(1).max(10).required(),
  semester_id: Joi.string().uuid().required(),
  teacher_id: Joi.string().uuid().optional()
});

export const updateSubjectBodySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  code: Joi.string().min(2).max(20).alphanum().optional(),
  credits: Joi.number().integer().min(1).max(10).optional(),
  course_id: Joi.string().uuid().optional(),
  semester_id: Joi.string().uuid().optional(),
  teacher_id: Joi.string().uuid().allow(null).optional()
});

export const subjectIdParamSchema = Joi.object({
  id: uuidSchema
});

export const subjectEnrollParamsSchema = Joi.object({
  subject_id: uuidSchema,
  student_id: uuidSchema
});

export const enrollStudentBodySchema = Joi.object({
  student_id: Joi.string().uuid().required()
});

// Enrollment schemas
export const createEnrollmentBodySchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  subject_id: Joi.string().uuid().required(),
  status: statusSchema.optional()
});

export const updateEnrollmentBodySchema = Joi.object({
  student_id: Joi.string().uuid().optional(),
  subject_id: Joi.string().uuid().optional(),
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

export const courseSubjectEnrollParamsSchema = Joi.object({
  course_id: uuidSchema,
  subject_id: uuidSchema,
  user_id: uuidSchema
});

export const courseSubjectUnenrollParamsSchema = Joi.object({
  course_id: uuidSchema,
  subject_id: uuidSchema,
  user_id: uuidSchema
});
