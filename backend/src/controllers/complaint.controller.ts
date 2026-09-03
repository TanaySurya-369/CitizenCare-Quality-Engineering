import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ComplaintService } from '../services/complaint.service';
import { StorageUtil } from '../utils/storage.util';
import { CreateComplaintSchema } from '../models/schemas';
import { z } from 'zod';

export class ComplaintController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const attachments = (files || []).map(f => ({
        fileName: f.filename,
        originalName: f.originalname,
        mimeType: f.mimetype,
        fileSize: f.size,
        fileUrl: StorageUtil.getPublicUrl(f.filename),
      }));

      // Parse and validate with Zod CreateComplaintSchema
      const rawInput = {
        categoryId: req.body.categoryId,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        priority: req.body.priority || undefined,
        latitude: req.body.latitude ? parseFloat(req.body.latitude) : undefined,
        longitude: req.body.longitude ? parseFloat(req.body.longitude) : undefined,
      };

      const validatedInput = CreateComplaintSchema.parse(rawInput);

      const complaint = await ComplaintService.createComplaint(
        req.user!,
        validatedInput,
        attachments,
        req.ip
      );

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: { complaint },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: validationErrors[0]?.message || 'Input validation failed',
          errorCode: 'VALIDATION_ERROR',
          errors: validationErrors,
        });
        return;
      }
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        citizenId: req.query.citizenId as string | undefined,
        assignedStaffId: req.query.assignedStaffId as string | undefined,
        departmentId: req.query.departmentId as string | undefined,
        categoryId: req.query.categoryId as string | undefined,
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
        search: req.query.search as string | undefined,
        isOverdue: req.query.isOverdue === 'true',
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await ComplaintService.listComplaints(req.user!, filters);

      res.status(200).json({
        success: true,
        message: 'Complaints retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const complaint = await ComplaintService.getComplaintById(req.params.id, req.user!);
      res.status(200).json({
        success: true,
        message: 'Complaint details retrieved successfully',
        data: { complaint },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const complaint = await ComplaintService.updateComplaintStatus(
        req.params.id,
        req.user!,
        req.body,
        req.ip
      );

      res.status(200).json({
        success: true,
        message: `Complaint status successfully updated to ${req.body.status}`,
        data: { complaint },
      });
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const complaint = await ComplaintService.assignStaff(
        req.params.id,
        req.body.staffId,
        req.user!,
        req.body.notes,
        req.ip
      );

      res.status(200).json({
        success: true,
        message: 'Staff assigned to complaint successfully',
        data: { complaint },
      });
    } catch (error) {
      next(error);
    }
  }
}
