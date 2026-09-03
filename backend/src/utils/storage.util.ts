import path from 'path';
import fs from 'fs';

export interface UploadedFileInfo {
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
}

export class StorageUtil {
  private static uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');

  static ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  static getPublicUrl(fileName: string): string {
    return `/uploads/${fileName}`;
  }

  static getFilePath(fileName: string): string {
    return path.join(this.uploadDir, fileName);
  }

  static deleteFile(fileName: string): void {
    const filePath = this.getFilePath(fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete file:', filePath, err);
      }
    }
  }
}
