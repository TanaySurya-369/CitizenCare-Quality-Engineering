import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required before role verification.',
        errorCode: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: User role [${req.user.role}] does not have permission to access this resource. Required: [${allowedRoles.join(', ')}]`,
        errorCode: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
};
