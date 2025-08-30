import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middlewares/validation';
import { authenticateToken } from '../middlewares/auth';
import Joi from 'joi';

const router = Router();

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Auth routes
router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/whoami', authenticateToken, AuthController.whoami);

export default router;

