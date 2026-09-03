import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { RegisterSchema, LoginSchema } from '../models/schemas';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateBody(RegisterSchema), AuthController.register);
router.post('/login', authLimiter, validateBody(LoginSchema), AuthController.login);
router.get('/me', authenticateToken, AuthController.getMe);
router.post('/logout', AuthController.logout);

export default router;
