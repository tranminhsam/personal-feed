import { Router } from 'express';
import { linkController } from '../controllers/linkController.js';

const router = Router();

router.get('/', linkController.getLinks);
router.post('/', linkController.createLink);
router.delete('/:id', linkController.deleteLink);

export default router;
