import { UserRepository } from '../repositories/user.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { RegisterInput, LoginInput } from '../models/schemas';

export class AuthService {
  static async register(input: RegisterInput, ipAddress?: string) {
    const existing = await UserRepository.findByEmail(input.email);
    if (existing) {
      const error: any = new Error('User already exists with this email address.');
      error.statusCode = 409;
      error.errorCode = 'USER_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await PasswordUtil.hash(input.password);
    const user = await UserRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      passwordHash,
      role: input.role || 'CITIZEN',
      status: 'ACTIVE',
      department: input.departmentId ? { connect: { id: input.departmentId } } : undefined,
    });

    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      departmentId: user.departmentId,
      name: user.name,
    });

    await AuditRepository.log({
      userId: user.id,
      action: 'USER_REGISTER',
      entity: 'USER',
      entityId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async login(input: LoginInput, ipAddress?: string) {
    const user = await UserRepository.findByEmail(input.email);
    if (!user) {
      const error: any = new Error('Invalid email or password credentials.');
      error.statusCode = 401;
      error.errorCode = 'INVALID_CREDENTIALS';
      throw error;
    }

    if (user.status !== 'ACTIVE') {
      const error: any = new Error('Account is suspended or deactivated. Contact administrator.');
      error.statusCode = 403;
      error.errorCode = 'ACCOUNT_INACTIVE';
      throw error;
    }

    const isValidPassword = await PasswordUtil.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error('Invalid email or password credentials.');
      error.statusCode = 401;
      error.errorCode = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      departmentId: user.departmentId,
      name: user.name,
    });

    await AuditRepository.log({
      userId: user.id,
      action: 'USER_LOGIN',
      entity: 'USER',
      entityId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getCurrentUser(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      error.errorCode = 'USER_NOT_FOUND';
      throw error;
    }
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
