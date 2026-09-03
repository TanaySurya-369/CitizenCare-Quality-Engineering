import prisma from '../../../backend/src/prisma';

export class DBClient {
  static getClient() {
    return prisma;
  }

  static async findComplaintById(id: string) {
    return prisma.complaint.findUnique({
      where: { id },
      include: {
        category: true,
        department: true,
        statusHistory: true,
        assignments: true,
        feedback: true,
        attachments: true,
      },
    });
  }

  static async getAuditLogsForEntity(entity: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}
