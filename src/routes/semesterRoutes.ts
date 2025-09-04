import { Router } from 'express';
import { SemesterController } from '../controllers/SemesterController';
import { validateBody, validateParams } from '../middlewares/validation';
import {
  createSemesterBodySchema,
  updateSemesterBodySchema,
  semesterIdParamSchema
} from '../utils/schemas';
import { authScope } from '../middlewares/auth';

const router = Router();

// CRUD routes
router.post('/', validateBody(createSemesterBodySchema), authScope('semesters:create'),SemesterController.create);
router.get('/', authScope('semesters:read'),SemesterController.getAll);
router.get('/:id', authScope('semesters:read'),validateParams(semesterIdParamSchema), SemesterController.getById);
router.put('/:id', 
  validateParams(semesterIdParamSchema),
  validateBody(updateSemesterBodySchema),
  authScope('semesters:update'),
  SemesterController.update
);
router.delete('/:id', authScope('semesters:delete'),validateParams(semesterIdParamSchema), SemesterController.delete);

export default router;
