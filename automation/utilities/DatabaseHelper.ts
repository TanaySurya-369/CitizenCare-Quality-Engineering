import prisma from '../../backend/src/prisma';

export class DatabaseHelper {
  static getClient() {
    return prisma;
  }

  static async findComplaintByNumber(complaintNumber: string) {
    return prisma.complaint.findUnique({
      where: { complaintNumber },
      include: {
        statusHistory: true,
        assignments: true,
        feedback: true,
        attachments: true,
      },
    });
  }

  static async getLatestAuditLogForEntity(entity: string, entityId: string) {
    return prisma.auditLog.findFirst({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}
