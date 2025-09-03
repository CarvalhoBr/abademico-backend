import { Router } from 'express';
import { SemesterController } from '../controllers/SemesterController';
import { validateBody, validateParams } from '../middlewares/validation';
import {
  createSemesterBodySchema,
  updateSemesterBodySchema,
  semesterIdParamSchema
} from '../utils/schemas';

const router = Router();

// CRUD routes
router.post('/', validateBody(createSemesterBodySchema), SemesterController.create);
router.get('/', SemesterController.getAll);
router.get('/:id', validateParams(semesterIdParamSchema), SemesterController.getById);
router.put('/:id', 
  validateParams(semesterIdParamSchema),
  validateBody(updateSemesterBodySchema),
  SemesterController.update
);
router.delete('/:id', validateParams(semesterIdParamSchema), SemesterController.delete);

export default router;
