import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { UpdateStatusSchema, AssignStaffSchema } from '../models/schemas';
import { upload, handleUploadError } from '../middleware/upload.middleware';

const router = Router();

// List complaints with role-filtered views
router.get('/', authenticateToken, ComplaintController.list);

// Get single complaint by ID / complaintNumber
router.get('/:id', authenticateToken, ComplaintController.getById);

// Create complaint with optional evidence file uploads (CITIZEN or ADMIN)
router.post(
  '/',
  authenticateToken,
  upload.array('attachments', 5),
  handleUploadError,
  ComplaintController.create
);

// Update status (STAFF or ADMIN only)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole('STAFF', 'ADMIN'),
  validateBody(UpdateStatusSchema),
  ComplaintController.updateStatus
);

// Assign staff to complaint (STAFF or ADMIN)
router.patch(
  '/:id/assign',
  authenticateToken,
  requireRole('STAFF', 'ADMIN'),
  validateBody(AssignStaffSchema),
  ComplaintController.assign
);

export default router;
