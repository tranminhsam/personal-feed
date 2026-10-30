import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

router.get('/', userController.getUser);
router.put('/', userController.updateUser);

export default router;
