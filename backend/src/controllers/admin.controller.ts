import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AnalyticsService } from '../services/analytics.service';
import { AuditRepository } from '../repositories/audit.repository';
import { UserRepository } from '../repositories/user.repository';
import prisma from '../prisma';

export class AdminController {
  static async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const kpis = await AnalyticsService.getSystemKPIs();
      res.status(200).json({
        success: true,
        data: kpis,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const logs = await AuditRepository.findRecent(limit);
      res.status(200).json({
        success: true,
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = req.query.role as string | undefined;
      const users = await UserRepository.listAllUsers(role);
      const safeUsers = users.map(({ passwordHash, ...u }) => u);
      res.status(200).json({
        success: true,
        data: { users: safeUsers },
      });
    } catch (error) {
      next(error);
    }
  }

  static async listStaff(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const departmentId = req.query.departmentId as string | undefined;
      const staff = await UserRepository.findStaffByDepartment(departmentId);
      const safeStaff = staff.map(({ passwordHash, ...u }) => u);
      res.status(200).json({
        success: true,
        data: { staff: safeStaff },
      });
    } catch (error) {
      next(error);
    }
  }
}
