import prisma from '../prisma';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { department: true },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { department: true },
    });
  }

  static async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
      include: { department: true },
    });
  }

  static async findStaffByDepartment(departmentId?: string): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      role: 'STAFF',
      status: 'ACTIVE',
      ...(departmentId ? { departmentId } : {}),
    };
    return prisma.user.findMany({
      where,
      include: { department: true },
      orderBy: { name: 'asc' },
    });
  }

  static async listAllUsers(role?: string): Promise<User[]> {
    return prisma.user.findMany({
      where: role ? { role } : undefined,
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
      include: { department: true },
    });
  }
}
