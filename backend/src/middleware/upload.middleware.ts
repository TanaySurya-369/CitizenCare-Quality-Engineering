import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { StorageUtil } from '../utils/storage.util';

StorageUtil.ensureUploadDirExists();

// Storage configuration with secure unique naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    StorageUtil.ensureUploadDirExists();
    cb(null, path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const safeName = `${Date.now()}-${uniqueId}${ext}`;
    cb(null, safeName);
  },
});

// Allowed MIME types: JPG, PNG, PDF
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE: Only JPG, PNG, WEBP, and PDF files are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Maximum 5 files per complaint
  },
  fileFilter,
});

export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File size exceeds the 5MB limit.',
        errorCode: 'FILE_TOO_LARGE',
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      errorCode: 'UPLOAD_ERROR',
    });
    return;
  }

  if (err && err.message && err.message.startsWith('INVALID_FILE_TYPE')) {
    res.status(400).json({
      success: false,
      message: err.message,
      errorCode: 'INVALID_FILE_TYPE',
    });
    return;
  }

  next(err);
};
