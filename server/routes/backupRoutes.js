import { Router } from 'express';
import { backupController } from '../controllers/backupController.js';

const router = Router();

router.get('/export', backupController.exportBackup);
router.post('/restore', backupController.restoreBackup);
router.post('/reset', backupController.resetData);

// Cloud Backup routes
router.post('/cloud', backupController.triggerCloudBackup);
router.get('/cloud/status', backupController.getCloudBackupStatus);
router.put('/cloud/config', backupController.saveCloudConfig);

export default router;
