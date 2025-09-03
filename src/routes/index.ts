import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import semesterRoutes from './semesterRoutes';
import subjectRoutes from './subjectRoutes';
import enrollmentRoutes from './enrollmentRoutes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/semesters', semesterRoutes);
// router.use('/subjects', subjectRoutes);
// router.use('/enrollments', enrollmentRoutes);

export default router;
