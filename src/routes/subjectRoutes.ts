import { Router } from 'express';
import { SubjectController } from '../controllers/SubjectController';
import { validateBody, validateParams } from '../middlewares/validation';
import { authenticateToken } from '../middlewares/auth';
import {
  updateSubjectBodySchema,
  subjectIdParamSchema,
  subjectEnrollParamsSchema,
  enrollStudentBodySchema
} from '../utils/schemas';

const router = Router();

// CRUD routes
router.get('/', SubjectController.getAll);
router.get('/:id', validateParams(subjectIdParamSchema), SubjectController.getById);
router.put('/:id', 
  validateParams(subjectIdParamSchema),
  validateBody(updateSubjectBodySchema),
  SubjectController.update
);
router.delete('/:id', validateParams(subjectIdParamSchema), SubjectController.delete);

// Additional routes
router.get('/:id/enrollments', validateParams(subjectIdParamSchema), SubjectController.getEnrollments);
router.post('/:id/enroll', 
  validateParams(subjectIdParamSchema),
  validateBody(enrollStudentBodySchema),
  SubjectController.enroll
);
router.delete('/:subject_id/enrollments/:student_id', 
  validateParams(subjectEnrollParamsSchema), 
  SubjectController.unenroll
);

export default router;
