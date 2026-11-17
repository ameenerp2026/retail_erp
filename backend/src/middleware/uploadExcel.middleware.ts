import type { NextFunction, Request, Response } from "express";
import multer from "multer";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const upload = multer({
  storage: multer.memoryStorage(),            // keep the file in memory, not on disk
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    const isXlsx =
      file.mimetype === XLSX_MIME && file.originalname.toLowerCase().endsWith(".xlsx");

    if (isXlsx) cb(null, true);                // accept
    else cb(new Error("Only .xlsx files are allowed")); // reject
  },
});

export const uploadExcel = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (error: unknown) => {
    if (!error) return next();                 // file is fine, go to the handler

    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "File must be 2 MB or smaller"
        : error instanceof Error
          ? error.message
          : "File upload failed";

    return res.status(400).json({ message });
  });
};