import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

// Admin analytics KPI endpoint
router.get(
  '/analytics',
  authenticateToken,
  requireRole('ADMIN', 'STAFF'),
  AdminController.getAnalytics
);

// Admin audit logs stream
router.get(
  '/audit-logs',
  authenticateToken,
  requireRole('ADMIN'),
  AdminController.getAuditLogs
);

// Admin list users
router.get(
  '/users',
  authenticateToken,
  requireRole('ADMIN'),
  AdminController.listUsers
);

// Admin / Staff list technicians
router.get(
  '/staff',
  authenticateToken,
  requireRole('ADMIN', 'STAFF'),
  AdminController.listStaff
);

export default router;
