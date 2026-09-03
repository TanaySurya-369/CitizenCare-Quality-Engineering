import prisma from '../prisma';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { ComplaintRepository } from '../repositories/complaint.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { SubmitFeedbackInput } from '../models/schemas';
import { TokenPayload } from '../utils/jwt.util';

export class FeedbackService {
  static async submitFeedback(
    complaintId: string,
    citizen: TokenPayload,
    input: SubmitFeedbackInput,
    ipAddress?: string
  ) {
    const complaint = await ComplaintRepository.findById(complaintId);
    if (!complaint) {
      const error: any = new Error(`Complaint #${complaintId} not found.`);
      error.statusCode = 404;
      error.errorCode = 'COMPLAINT_NOT_FOUND';
      throw error;
    }

    if (complaint.citizenId !== citizen.userId) {
      const error: any = new Error('Only the citizen who filed this complaint can submit resolution feedback.');
      error.statusCode = 403;
      error.errorCode = 'FORBIDDEN';
      throw error;
    }

    if (complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED') {
      const error: any = new Error('Feedback can only be provided after a complaint has been RESOLVED or CLOSED.');
      error.statusCode = 400;
      error.errorCode = 'COMPLAINT_NOT_RESOLVED';
      throw error;
    }

    const existing = await FeedbackRepository.findByComplaintId(complaint.id);
    if (existing) {
      const error: any = new Error('Feedback has already been submitted for this complaint.');
      error.statusCode = 409;
      error.errorCode = 'FEEDBACK_ALREADY_EXISTS';
      throw error;
    }

    const feedback = await FeedbackRepository.create({
      complaintId: complaint.id,
      citizenId: citizen.userId,
      rating: input.rating,
      comment: input.comment,
      resolutionConfirmed: input.resolutionConfirmed,
    });

    // Auto close complaint if citizen confirms resolution
    if (complaint.status === 'RESOLVED' && input.resolutionConfirmed) {
      await ComplaintRepository.updateStatus(
        complaint.id,
        'CLOSED',
        citizen.userId,
        `Citizen confirmed resolution and rated service ${input.rating}/5 stars.`
      );
    }

    // Audit log
    await AuditRepository.log({
      userId: citizen.userId,
      action: 'SUBMIT_FEEDBACK',
      entity: 'FEEDBACK',
      entityId: feedback.id,
      details: {
        complaintId: complaint.id,
        rating: input.rating,
        comment: input.comment,
      },
      ipAddress,
    });

    return feedback;
  }

  static async getFeedbackByComplaintId(complaintId: string) {
    return FeedbackRepository.findByComplaintId(complaintId);
  }
}
