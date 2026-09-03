import prisma from '../prisma';
import { AuditLog } from '@prisma/client';

export class AuditRepository {
  static async log(data: {
    userId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: any;
    ipAddress?: string | null;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId || null,
        details: data.details ? JSON.stringify(data.details) : null,
        ipAddress: data.ipAddress || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  static async findRecent(limit: number = 50): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  static async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }
}
