import { Router } from 'express';
import authRoutes from './auth.routes';
import complaintRoutes from './complaint.routes';
import feedbackRoutes from './feedback.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import metaRoutes from './meta.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/complaints', feedbackRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/', metaRoutes);

export default router;
