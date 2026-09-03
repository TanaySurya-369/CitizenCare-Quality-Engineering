import { Request, Response, NextFunction } from 'express';
import { DepartmentRepository } from '../repositories/department.repository';
import prisma from '../prisma';

export class MetaController {
  static async getDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await DepartmentRepository.listAll();
      res.status(200).json({
        success: true,
        data: { departments },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await DepartmentRepository.listCategories();
      res.status(200).json({
        success: true,
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }

  static async health(req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        success: true,
        status: 'UP',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected',
      });
    } catch (err: any) {
      res.status(503).json({
        success: false,
        status: 'DOWN',
        database: 'Disconnected',
        error: err.message,
      });
    }
  }
}
