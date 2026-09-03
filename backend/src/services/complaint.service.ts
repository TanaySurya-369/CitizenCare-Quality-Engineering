import prisma from '../prisma';
import { ComplaintRepository, ComplaintFilterParams } from '../repositories/complaint.repository';
import { DepartmentRepository } from '../repositories/department.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { SLAUtil, PriorityLevel } from '../utils/sla.util';
import { CreateComplaintInput, UpdateStatusInput } from '../models/schemas';
import { TokenPayload } from '../utils/jwt.util';

export class ComplaintService {
  /**
   * Create a new complaint with category lookup, SLA calculation, notification and audit logging.
   */
  static async createComplaint(
    citizen: TokenPayload,
    input: CreateComplaintInput,
    attachments: Array<{ fileName: string; originalName: string; mimeType: string; fileSize: number; fileUrl: string }> = [],
    ipAddress?: string
  ) {
    const category = await DepartmentRepository.findCategoryById(input.categoryId);
    if (!category) {
      const error: any = new Error(`Complaint Category with ID [${input.categoryId}] not found.`);
      error.statusCode = 404;
      error.errorCode = 'CATEGORY_NOT_FOUND';
      throw error;
    }

    const priority = (input.priority || category.defaultPriority) as PriorityLevel;
    const expectedResolutionDate = SLAUtil.calculateExpectedResolutionDate(priority);

    const complaint = await ComplaintRepository.create({
      citizenId: citizen.userId,
      categoryId: category.id,
      departmentId: category.departmentId,
      title: input.title,
      description: input.description,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      priority,
      expectedResolutionDate,
    });

    // Link attachments if any
    if (attachments.length > 0) {
      await prisma.attachment.createMany({
        data: attachments.map(att => ({
          complaintId: complaint.id,
          fileName: att.fileName,
          originalName: att.originalName,
          mimeType: att.mimeType,
          fileSize: att.fileSize,
          fileUrl: att.fileUrl,
          uploadedById: citizen.userId,
        })),
      });
    }

    // Create Notification for Citizen
    await NotificationRepository.create({
      userId: citizen.userId,
      complaintId: complaint.id,
      title: 'Complaint Registered Successfully',
      message: `Your complaint #${complaint.complaintNumber} ("${complaint.title}") has been registered with ${category.name}. Expected resolution by ${expectedResolutionDate.toLocaleDateString()}.`,
    });

    // Create Audit Log
    await AuditRepository.log({
      userId: citizen.userId,
      action: 'CREATE_COMPLAINT',
      entity: 'COMPLAINT',
      entityId: complaint.id,
      details: {
        complaintNumber: complaint.complaintNumber,
        category: category.name,
        priority,
        expectedResolutionDate,
        attachmentsCount: attachments.length,
      },
      ipAddress,
    });

    return this.getComplaintById(complaint.id, citizen);
  }

  /**
   * Fetch a single complaint by ID with RBAC isolation and SLA status metadata.
   */
  static async getComplaintById(id: string, user: TokenPayload) {
    const complaint = await ComplaintRepository.findById(id);
    if (!complaint) {
      const error: any = new Error(`Complaint #${id} not found.`);
      error.statusCode = 404;
      error.errorCode = 'COMPLAINT_NOT_FOUND';
      throw error;
    }

    // Role-based isolation check
    if (user.role === 'CITIZEN' && complaint.citizenId !== user.userId) {
      const error: any = new Error('Access denied: You do not have permission to view this complaint.');
      error.statusCode = 403;
      error.errorCode = 'FORBIDDEN';
      throw error;
    }

    const slaInfo = SLAUtil.getSlaStatus(
      complaint.expectedResolutionDate,
      complaint.status,
      complaint.resolvedDate
    );

    return {
      ...complaint,
      slaInfo,
    };
  }

  /**
   * List complaints with filtering and pagination.
   */
  static async listComplaints(user: TokenPayload, filters: ComplaintFilterParams) {
    const params: ComplaintFilterParams = { ...filters };

    // Strict RBAC filtering
    if (user.role === 'CITIZEN') {
      params.citizenId = user.userId;
    } else if (user.role === 'STAFF') {
      if (!filters.assignedStaffId && !filters.departmentId && user.departmentId) {
        params.departmentId = user.departmentId;
      }
    }

    const result = await ComplaintRepository.findManyWithFilters(params);

    const complaintsWithSla = result.complaints.map(c => ({
      ...c,
      slaInfo: SLAUtil.getSlaStatus(c.expectedResolutionDate, c.status, c.resolvedDate),
    }));

    return {
      ...result,
      complaints: complaintsWithSla,
    };
  }

  /**
   * Update complaint status with strict state machine validation and citizen alert.
   */
  static async updateComplaintStatus(
    id: string,
    user: TokenPayload,
    input: UpdateStatusInput,
    ipAddress?: string
  ) {
    const complaint = await ComplaintRepository.findById(id);
    if (!complaint) {
      const error: any = new Error(`Complaint #${id} not found.`);
      error.statusCode = 404;
      error.errorCode = 'COMPLAINT_NOT_FOUND';
      throw error;
    }

    // Validation of state machine transition
    const validTransitions: Record<string, string[]> = {
      SUBMITTED: ['ACKNOWLEDGED', 'ASSIGNED', 'REJECTED'],
      ACKNOWLEDGED: ['ASSIGNED', 'IN_PROGRESS', 'REJECTED'],
      ASSIGNED: ['IN_PROGRESS', 'RESOLVED', 'REJECTED'],
      IN_PROGRESS: ['RESOLVED', 'REJECTED'],
      RESOLVED: ['CLOSED'],
      REJECTED: [],
      CLOSED: [],
    };

    const allowedNext = validTransitions[complaint.status] || [];
    if (!allowedNext.includes(input.status)) {
      const error: any = new Error(
        `Invalid status transition from ${complaint.status} to ${input.status}. Allowed: [${allowedNext.join(', ')}]`
      );
      error.statusCode = 400;
      error.errorCode = 'INVALID_STATUS_TRANSITION';
      throw error;
    }

    const updated = await ComplaintRepository.updateStatus(
      complaint.id,
      input.status,
      user.userId,
      input.remarks,
      input.rejectionReason
    );

    // Notify citizen about status change
    await NotificationRepository.create({
      userId: complaint.citizenId,
      complaintId: complaint.id,
      title: `Status Updated: #${complaint.complaintNumber}`,
      message: `Your complaint #${complaint.complaintNumber} is now ${input.status}. ${input.remarks ? `Note: ${input.remarks}` : ''}`,
    });

    // Audit log
    await AuditRepository.log({
      userId: user.userId,
      action: 'UPDATE_STATUS',
      entity: 'COMPLAINT',
      entityId: complaint.id,
      details: {
        from: complaint.status,
        to: input.status,
        remarks: input.remarks,
        rejectionReason: input.rejectionReason,
      },
      ipAddress,
    });

    return this.getComplaintById(complaint.id, user);
  }

  /**
   * Assign staff to complaint.
   */
  static async assignStaff(
    complaintId: string,
    staffId: string,
    assignedBy: TokenPayload,
    notes?: string,
    ipAddress?: string
  ) {
    const complaint = await ComplaintRepository.findById(complaintId);
    if (!complaint) {
      const error: any = new Error(`Complaint #${complaintId} not found.`);
      error.statusCode = 404;
      error.errorCode = 'COMPLAINT_NOT_FOUND';
      throw error;
    }

    const updated = await ComplaintRepository.assignStaff(
      complaint.id,
      staffId,
      assignedBy.userId,
      notes
    );

    // Notify assigned staff
    await NotificationRepository.create({
      userId: staffId,
      complaintId: complaint.id,
      title: `New Assignment: #${complaint.complaintNumber}`,
      message: `You have been assigned complaint #${complaint.complaintNumber}: "${complaint.title}".`,
    });

    // Notify citizen
    await NotificationRepository.create({
      userId: complaint.citizenId,
      complaintId: complaint.id,
      title: `Staff Assigned: #${complaint.complaintNumber}`,
      message: `A municipal technician has been assigned to investigate your complaint.`,
    });

    // Audit log
    await AuditRepository.log({
      userId: assignedBy.userId,
      action: 'ASSIGN_STAFF',
      entity: 'COMPLAINT',
      entityId: complaint.id,
      details: { staffId, notes },
      ipAddress,
    });

    return this.getComplaintById(complaint.id, assignedBy);
  }
}
