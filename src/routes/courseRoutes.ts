import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { validateBody, validateParams } from '../middlewares/validation';
import {
  createCourseBodySchema,
  updateCourseBodySchema,
  courseIdParamSchema
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

export default router;
