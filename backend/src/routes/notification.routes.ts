import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, NotificationController.list);
router.patch('/:id/read', authenticateToken, NotificationController.markAsRead);
router.patch('/read-all', authenticateToken, NotificationController.markAllAsRead);

export default router;
