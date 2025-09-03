import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import semesterRoutes from './semesterRoutes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/semesters', semesterRoutes);

export default router;
