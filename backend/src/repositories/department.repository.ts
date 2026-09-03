import prisma from '../prisma';
import { Department, ComplaintCategory } from '@prisma/client';

export class DepartmentRepository {
  static async listAll(): Promise<(Department & { categories: ComplaintCategory[] })[]> {
    return prisma.department.findMany({
      include: {
        categories: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  static async findCategoryById(id: string): Promise<ComplaintCategory | null> {
    return prisma.complaintCategory.findUnique({
      where: { id },
      include: { department: true },
    });
  }

  static async listCategories(): Promise<ComplaintCategory[]> {
    return prisma.complaintCategory.findMany({
      include: { department: true },
      orderBy: { name: 'asc' },
    });
  }
}
