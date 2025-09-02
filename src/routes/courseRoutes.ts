import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { validateBody, validateParams } from '../middlewares/validation';
import { authenticateToken } from '../middlewares/auth';
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
router.post('/', validateBody(createCourseBodySchema), CourseController.create);
router.get('/', CourseController.getAll);
router.get('/:id', validateParams(courseIdParamSchema), CourseController.getById);
router.put('/:id', 
  validateParams(courseIdParamSchema),
  validateBody(updateCourseBodySchema),
  CourseController.update
);
router.delete('/:id', validateParams(courseIdParamSchema), CourseController.delete);

// Additional routes
router.get('/:id/semesters', validateParams(courseIdParamSchema), CourseController.getSemesters);
router.get('/:id/students', validateParams(courseIdParamSchema), CourseController.getStudents);
router.get('/:id/teachers', validateParams(courseIdParamSchema), CourseController.getTeachers);
router.get('/:id/:semester_id/subjects', authenticateToken, validateParams(courseSubjectsParamSchema), CourseController.getSubjects);
router.post('/:id/subjects', 
  validateParams(courseIdParamSchema),
  validateBody(createSubjectInCourseBodySchema),
  CourseController.createSubject
);

// Subject enrollment routes
router.post('/:course_id/subjects/:subject_id/enroll/:user_id', 
  validateParams(courseSubjectEnrollParamsSchema),
  CourseController.enrollInSubject
);
router.delete('/:course_id/subjects/:subject_id/enrollment/:user_id', 
  validateParams(courseSubjectUnenrollParamsSchema),
  CourseController.unenrollFromSubject
);

export default router;
