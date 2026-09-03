import { Request, Response, NextFunction } from 'express';
import { JwtUtil, TokenPayload } from '../utils/jwt.util';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Missing or invalid Authorization Bearer token.',
      errorCode: 'UNAUTHORIZED',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError' ? 'Token expired. Please login again.' : 'Invalid token.',
      errorCode: 'INVALID_TOKEN',
    });
  }
};
