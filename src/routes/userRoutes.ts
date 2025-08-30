import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateBody, validateParams } from '../middlewares/validation';
import {
  createUserBodySchema,
  updateUserBodySchema,
  userRoleParamSchema,
  userIdParamSchema,
  roleSchema
} from '../utils/schemas';
import Joi from 'joi';

const router = Router();

// CRUD routes
router.get('/', UserController.getAll);
router.get('/:id', validateParams(userIdParamSchema), UserController.getById);
router.put('/:id', 
  validateParams(userIdParamSchema),
  validateBody(updateUserBodySchema),
  UserController.update
);
router.delete('/:id', validateParams(userIdParamSchema), UserController.delete);

// Special route for creating users by role (as specified in PRD)
router.post('/:role', 
  validateParams(userRoleParamSchema),
  validateBody(createUserBodySchema),
  UserController.create
);

// Additional routes
router.get('/role/:role', 
  validateParams(Joi.object({ role: roleSchema })), 
  UserController.getByRole
);

export default router;
