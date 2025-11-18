import Class from '../models/Class.js';
import ClassEnrollment from '../models/ClassEnrollment.js';
import crypto from 'crypto';

// Generate QR code for a class session
export const generateClassQR = async (req, res) => {
  try {
    const { classId } = req.params;
    const { validMinutes = 60 } = req.body; // QR valid for 60 minutes by default

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học' });
    }

    // Generate unique QR code with timestamp
    const timestamp = Date.now();
    const expiresAt = timestamp + (validMinutes * 60 * 1000);
    
    // Create secure hash to prevent tampering
    const secret = process.env.QR_SECRET || 'gym-app-qr-secret-key-2024';
    const data = `${classId}:${timestamp}:${expiresAt}`;
    const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
    
    // QR Code format: CLASS:{classId}:{timestamp}:{expiresAt}:{hash}
    const qrCode = `CLASS:${classId}:${timestamp}:${expiresAt}:${hash}`;

    res.json({
      qrCode,
      className: classDoc.name,
      classTime: classDoc.time,
      validUntil: new Date(expiresAt),
      expiresAt,
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ message: 'Lỗi tạo mã QR', error: error.message });
  }
};

// Verify and validate QR code
const verifyQRCode = (qrCode) => {
  try {
    const parts = qrCode.split(':');
    
    if (parts.length < 5 || parts[0] !== 'CLASS') {
      return { valid: false, error: 'Mã QR không đúng định dạng' };
    }

    const [, classId, timestamp, expiresAt, hash] = parts;
    
    // Check expiration
    const now = Date.now();
    if (now > parseInt(expiresAt)) {
      return { valid: false, error: 'Mã QR đã hết hạn' };
    }

    // Verify hash to prevent tampering
    const secret = process.env.QR_SECRET || 'gym-app-qr-secret-key-2024';
    const data = `${classId}:${timestamp}:${expiresAt}`;
    const expectedHash = crypto.createHmac('sha256', secret).update(data).digest('hex');
    
    if (hash !== expectedHash) {
      return { valid: false, error: 'Mã QR không hợp lệ (đã bị thay đổi)' };
    }

    return { valid: true, classId, timestamp };
  } catch (error) {
    return { valid: false, error: 'Lỗi xác thực mã QR' };
  }
};

// Get all QR codes generated for a class (admin only)
export const getClassQRHistory = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học' });
    }

    // In production, store QR history in database
    // For now, just return class info
    res.json({
      classId,
      className: classDoc.name,
      message: 'QR codes are generated on-demand and expire after use',
    });
  } catch (error) {
    console.error('Get QR history error:', error);
    res.status(500).json({ message: 'Lỗi lấy lịch sử QR', error: error.message });
  }
};

export { verifyQRCode };
