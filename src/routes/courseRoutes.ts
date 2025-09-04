import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { validateBody, validateParams } from '../middlewares/validation';
import { authenticateToken, authScope } from '../middlewares/auth';
import {
  createCourseBodySchema,
  updateCourseBodySchema,
  courseIdParamSchema,
  courseSubjectsParamSchema,
  createSubjectInCourseBodySchema,
  courseSubjectEnrollParamsSchema,
  courseSubjectUnenrollParamsSchema
} from '../utils/schemas';

const router = Router();

// CRUD routes
router.post('/', authScope('courses:create'), validateBody(createCourseBodySchema), CourseController.create);
router.get('/', authScope('courses:read'), CourseController.getAll);
router.get('/:id', authScope('courses:read'), validateParams(courseIdParamSchema), CourseController.getById);
router.put('/:id', 
  validateParams(courseIdParamSchema),
  validateBody(updateCourseBodySchema),
  authScope('courses:update'),
  CourseController.update
);
router.delete('/:id', authScope('courses:delete'), validateParams(courseIdParamSchema), CourseController.delete);

// Additional routes
router.get('/:id/semesters', authScope('courses:read'), validateParams(courseIdParamSchema), CourseController.getSemesters);
router.get('/:id/students', authScope('courses:listStudents'), validateParams(courseIdParamSchema), CourseController.getStudents);
router.get('/:id/teachers', authScope('courses:listTeachers'), validateParams(courseIdParamSchema), CourseController.getTeachers);
router.get('/:id/:semester_id/subjects', authScope('courses:read'), validateParams(courseSubjectsParamSchema), CourseController.getSubjects);
router.post('/:id/subjects', 
  validateParams(courseIdParamSchema),
  validateBody(createSubjectInCourseBodySchema),
  authScope('courses:createSubject'),
  CourseController.createSubject
);

// Subject enrollment routes
router.post('/:course_id/subjects/:subject_id/enroll/:user_id', 
  validateParams(courseSubjectEnrollParamsSchema),
  authScope('courses:enrollSubject'),
  CourseController.enrollInSubject
);
router.delete('/:course_id/subjects/:subject_id/enrollment/:user_id', 
  validateParams(courseSubjectUnenrollParamsSchema),
  authScope('courses:enrollSubject'),
  CourseController.unenrollFromSubject
);

export default router;
