import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadCommentImages, getCommentAttachments, deleteAttachment } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter: images, PDF, Excel, video
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    // PDF
    'application/pdf',
    // Excel
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    // Video
    'video/mp4', 'video/quicktime', // mp4, mov
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('ไฟล์ที่รองรับ: รูปภาพ (JPEG, PNG, GIF, WebP), PDF, Excel (xlsx/xls), วิดีโอ (MP4, MOV)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max per file
});

// All routes require authentication
router.use(authenticate);

// Upload files for a comment (max 5 files, 20MB each)
router.post('/comments/:commentId/attachments', upload.array('images', 5), uploadCommentImages);

// Get attachments for a comment
router.get('/comments/:commentId/attachments', getCommentAttachments);

// Delete attachment
router.delete('/attachments/:id', deleteAttachment);

export default router;
