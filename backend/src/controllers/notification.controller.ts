import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await NotificationRepository.findByUserId(req.user!.userId);
      const unreadCount = notifications.filter(n => !n.isRead).length;

      res.status(200).json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await NotificationRepository.markAsRead(req.params.id, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: { notification },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await NotificationRepository.markAllAsRead(req.user!.userId);
      res.status(200).json({
        success: true,
        message: `${count} notifications marked as read`,
      });
    } catch (error) {
      next(error);
    }
  }
}
