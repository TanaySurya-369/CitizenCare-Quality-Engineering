import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { FeedbackService } from '../services/feedback.service';

export class FeedbackController {
  static async submit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedback = await FeedbackService.submitFeedback(
        req.params.id,
        req.user!,
        req.body,
        req.ip
      );

      res.status(201).json({
        success: true,
        message: 'Resolution feedback and rating submitted successfully',
        data: { feedback },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByComplaintId(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedback = await FeedbackService.getFeedbackByComplaintId(req.params.id);
      res.status(200).json({
        success: true,
        data: { feedback },
      });
    } catch (error) {
      next(error);
    }
  }
}
