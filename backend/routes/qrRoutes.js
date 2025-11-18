import express from 'express';
import { generateClassQR, getClassQRHistory } from '../controllers/qrController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate QR code for a class (admin/instructor only)
router.post('/class/:classId/generate', verifyToken, generateClassQR);

// Get QR history for a class (admin only)
router.get('/class/:classId/history', verifyToken, getClassQRHistory);

export default router;
