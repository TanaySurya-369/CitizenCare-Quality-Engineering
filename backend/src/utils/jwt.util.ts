import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CITIZEN' | 'STAFF' | 'ADMIN';
  departmentId?: string | null;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'citizencare_jwt_fallback_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class JwtUtil {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }
}
