import prisma from '../prisma';
import { Notification } from '@prisma/client';

export class NotificationRepository {
  static async create(data: {
    userId: string;
    complaintId?: string;
    title: string;
    message: string;
    type?: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        complaintId: data.complaintId,
        title: data.title,
        message: data.message,
        type: data.type || 'IN_APP',
        isRead: false,
      },
      include: { complaint: { select: { complaintNumber: true, title: true } } },
    });
  }

  static async findByUserId(userId: string, limit: number = 50): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        complaint: { select: { id: true, complaintNumber: true, title: true, status: true } },
      },
    });
  }

  static async markAsRead(id: string, userId: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return result.count;
  }
}
