import { Router } from 'express';
import { FeedbackController } from '../controllers/feedback.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { SubmitFeedbackSchema } from '../models/schemas';

const router = Router();

router.post(
  '/:id/feedback',
  authenticateToken,
  requireRole('CITIZEN', 'ADMIN'),
  validateBody(SubmitFeedbackSchema),
  FeedbackController.submit
);

router.get(
  '/:id/feedback',
  authenticateToken,
  FeedbackController.getByComplaintId
);

export default router;
