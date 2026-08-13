import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
  }
};

export const createUploader = (subfolder: string, maxCount: number) => {
  const uploadPath = path.join(process.cwd(), "uploads", subfolder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE, files: maxCount },
  });
};

export const uploadProductImages = createUploader("products", 5);
