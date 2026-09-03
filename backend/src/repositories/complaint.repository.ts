import prisma from '../prisma';
import { Complaint, Prisma } from '@prisma/client';

export interface ComplaintFilterParams {
  citizenId?: string;
  assignedStaffId?: string;
  departmentId?: string;
  categoryId?: string;
  status?: string;
  priority?: string;
  search?: string;
  isOverdue?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ComplaintRepository {
  static async generateNextComplaintNumber(): Promise<string> {
    const count = await prisma.complaint.count();
    const sequence = 1000 + count + 1;
    return `C-${sequence}`;
  }

  static async create(data: {
    citizenId: string;
    categoryId: string;
    departmentId: string;
    title: string;
    description: string;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    priority: string;
    expectedResolutionDate: Date;
  }): Promise<Complaint> {
    const complaintNumber = await this.generateNextComplaintNumber();

    return prisma.$transaction(async (tx) => {
      const complaint = await tx.complaint.create({
        data: {
          complaintNumber,
          citizenId: data.citizenId,
          categoryId: data.categoryId,
          departmentId: data.departmentId,
          title: data.title,
          description: data.description,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          priority: data.priority,
          status: 'SUBMITTED',
          expectedResolutionDate: data.expectedResolutionDate,
        },
        include: {
          category: true,
          department: true,
          citizen: { select: { id: true, name: true, email: true, phone: true } },
          attachments: true,
        },
      });

      // Create initial status history
      await tx.complaintStatusHistory.create({
        data: {
          complaintId: complaint.id,
          oldStatus: null,
          newStatus: 'SUBMITTED',
          changedById: data.citizenId,
          remarks: 'Complaint registered by citizen',
        },
      });

      return complaint;
    });
  }

  static async findById(id: string): Promise<any | null> {
    return prisma.complaint.findFirst({
      where: {
        OR: [{ id }, { complaintNumber: id }],
      },
      include: {
        category: true,
        department: true,
        citizen: { select: { id: true, name: true, email: true, phone: true } },
        assignedStaff: { select: { id: true, name: true, email: true, phone: true } },
        attachments: { include: { uploadedBy: { select: { id: true, name: true } } } },
        statusHistory: {
          include: { changedBy: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
        assignments: {
          include: {
            staff: { select: { id: true, name: true, email: true } },
            assignedBy: { select: { id: true, name: true } },
          },
          orderBy: { assignedAt: 'desc' },
        },
        feedback: true,
      },
    });
  }

  static async findManyWithFilters(params: ComplaintFilterParams): Promise<{
    complaints: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ComplaintWhereInput = {};

    if (params.citizenId) {
      where.citizenId = params.citizenId;
    }

    if (params.assignedStaffId) {
      where.assignedStaffId = params.assignedStaffId;
    }

    if (params.departmentId) {
      where.departmentId = params.departmentId;
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.status) {
      where.status = params.status.toUpperCase();
    }

    if (params.priority) {
      where.priority = params.priority.toUpperCase();
    }

    if (params.isOverdue) {
      where.expectedResolutionDate = { lt: new Date() };
      where.status = { notIn: ['RESOLVED', 'CLOSED', 'REJECTED'] };
    }

    if (params.search) {
      where.OR = [
        { complaintNumber: { contains: params.search } },
        { title: { contains: params.search } },
        { description: { contains: params.search } },
        { location: { contains: params.search } },
      ];
    }

    const orderBy: Prisma.ComplaintOrderByWithRelationInput = {};
    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    if (sortField === 'expectedResolutionDate' || sortField === 'createdAt' || sortField === 'priority') {
      (orderBy as any)[sortField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          department: true,
          citizen: { select: { id: true, name: true, email: true } },
          assignedStaff: { select: { id: true, name: true, email: true } },
          attachments: true,
          feedback: true,
        },
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateStatus(
    complaintId: string,
    newStatus: string,
    changedById: string,
    remarks?: string,
    rejectionReason?: string
  ): Promise<Complaint> {
    return prisma.$transaction(async (tx) => {
      const current = await tx.complaint.findUnique({ where: { id: complaintId } });
      if (!current) {
        throw new Error(`Complaint ${complaintId} not found`);
      }

      const updateData: Prisma.ComplaintUpdateInput = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
        updateData.resolvedDate = new Date();
      }

      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      const updated = await tx.complaint.update({
        where: { id: complaintId },
        data: updateData,
        include: {
          category: true,
          department: true,
          citizen: { select: { id: true, name: true, email: true } },
          assignedStaff: { select: { id: true, name: true, email: true } },
          attachments: true,
        },
      });

      await tx.complaintStatusHistory.create({
        data: {
          complaintId,
          oldStatus: current.status,
          newStatus,
          changedById,
          remarks: remarks || `Status updated from ${current.status} to ${newStatus}`,
        },
      });

      return updated;
    });
  }

  static async assignStaff(
    complaintId: string,
    staffId: string,
    assignedById: string,
    notes?: string
  ): Promise<Complaint> {
    return prisma.$transaction(async (tx) => {
      const current = await tx.complaint.findUnique({ where: { id: complaintId } });
      if (!current) {
        throw new Error(`Complaint ${complaintId} not found`);
      }

      // Mark previous assignments inactive
      await tx.staffAssignment.updateMany({
        where: { complaintId, isActive: true },
        data: { isActive: false },
      });

      // Create new assignment record
      await tx.staffAssignment.create({
        data: {
          complaintId,
          staffId,
          assignedById,
          notes,
          isActive: true,
        },
      });

      const nextStatus = current.status === 'SUBMITTED' || current.status === 'ACKNOWLEDGED'
        ? 'ASSIGNED'
        : current.status;

      const updated = await tx.complaint.update({
        where: { id: complaintId },
        data: {
          assignedStaffId: staffId,
          status: nextStatus,
          updatedAt: new Date(),
        },
        include: {
          category: true,
          department: true,
          citizen: { select: { id: true, name: true, email: true } },
          assignedStaff: { select: { id: true, name: true, email: true } },
          attachments: true,
        },
      });

      if (nextStatus !== current.status) {
        await tx.complaintStatusHistory.create({
          data: {
            complaintId,
            oldStatus: current.status,
            newStatus: nextStatus,
            changedById: assignedById,
            remarks: notes || `Complaint assigned to staff member`,
          },
        });
      }

      return updated;
    });
  }

  static async delete(id: string): Promise<Complaint> {
    return prisma.complaint.delete({
      where: { id },
    });
  }
}
