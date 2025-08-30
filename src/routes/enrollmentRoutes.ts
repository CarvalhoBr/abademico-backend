import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { validateBody, validateParams } from '../middlewares/validation';
import {
  createEnrollmentBodySchema,
  updateEnrollmentBodySchema,
  enrollmentIdParamSchema,
  enrollmentStatusParamSchema
} from '../utils/schemas';

const router = Router();

// CRUD routes
router.post('/', validateBody(createEnrollmentBodySchema), EnrollmentController.create);
router.get('/', EnrollmentController.getAll);
router.get('/:id', validateParams(enrollmentIdParamSchema), EnrollmentController.getById);
router.put('/:id', 
  validateParams(enrollmentIdParamSchema),
  validateBody(updateEnrollmentBodySchema),
  EnrollmentController.update
);
router.delete('/:id', validateParams(enrollmentIdParamSchema), EnrollmentController.delete);

// Additional routes
router.get('/status/:status', validateParams(enrollmentStatusParamSchema), EnrollmentController.getByStatus);

export default router;
