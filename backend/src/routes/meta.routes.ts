import { Router } from 'express';
import { MetaController } from '../controllers/meta.controller';

const router = Router();

router.get('/departments', MetaController.getDepartments);
router.get('/categories', MetaController.getCategories);
router.get('/health', MetaController.health);

export default router;
