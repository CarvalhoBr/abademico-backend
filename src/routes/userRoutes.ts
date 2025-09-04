import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateBody, validateParams } from '../middlewares/validation';
import {
  createUserBodySchema,
  updateUserBodySchema,
  addUserCourseBodySchema,
  userCourseParamsSchema,
  userRoleParamSchema,
  userIdParamSchema,
  roleSchema
} from '../utils/schemas';
import Joi from 'joi';
import { authScope } from '../middlewares/auth';

const router = Router();

// CRUD routes
router.get('/', authScope('users:read'), UserController.getAll);
router.get('/:id', authScope('users:read'),validateParams(userIdParamSchema), UserController.getById);
router.put('/:id', 
  validateParams(userIdParamSchema),
  validateBody(updateUserBodySchema),
  authScope('users:update'),
  UserController.update
);
router.delete('/:id', authScope('users:delete'), validateParams(userIdParamSchema), UserController.delete);

// Special route for creating users by role (as specified in PRD)
router.post('/:role', 
  validateParams(userRoleParamSchema),
  validateBody(createUserBodySchema),
  (req, res, next) => {
    const { role } = req.params
    authScope(`users:create-${role}`)(req, res, next)
  },
  UserController.create
);

// User courses management routes
router.get('/:id/courses', authScope('users:read'), validateParams(userIdParamSchema), UserController.getCourses);
router.post('/:id/courses', 
  validateParams(userIdParamSchema),
  validateBody(addUserCourseBodySchema),
  authScope('users:update'),
  UserController.addCourse
);
router.delete('/:id/courses/:course_id', 
  validateParams(userCourseParamsSchema),
  authScope('users:update'),
  UserController.removeCourse
);

// Additional routes
router.get('/role/:role', 
  validateParams(Joi.object({ role: roleSchema })),
  authScope('users:read'),
  UserController.getByRole
);

export default router;
