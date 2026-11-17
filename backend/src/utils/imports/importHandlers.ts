import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { audit } from "../admin/securities/audit.utils.js";
import { buildTemplate } from "./buildTemplate.js";
import { runImport } from "./runImport.js";
import type { ImportDefinition } from "./import.types.js";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Uses the exact parameter types of your audit function
type AuditOptions = {
  module: Parameters<typeof audit>[1];
  successAction: Parameters<typeof audit>[2];
  failureAction: Parameters<typeof audit>[2];
};

const sendImportError = (error: any, res: Response, uniqueColumn: string) => {
  // Someone saved the same value between our check and our save
  if (error?.code === "P2002") {
    return res.status(409).json({ message: `${uniqueColumn} already exists. Nothing was imported.` });
  }
  if (error?.status) {
    return res.status(error.status).json({
      message: error.message,
      ...(error.errors?.length ? { errors: error.errors } : {}),
    });
  }
  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
};

// Handler for POST .../import
export const createImportHandler =
  <T, K extends string>(definition: ImportDefinition<T, K>, auditOptions: AuditOptions) =>
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Upload an .xlsx file in the 'file' field" });
      }

      const result = await runImport(definition, req.file.buffer, (req as any).user.id);

      await audit(
        req as AuthRequest,
        auditOptions.module,
        auditOptions.successAction,
        `Imported ${result.imported} ${definition.label} from ${req.file.originalname}`,
      );

      return res.status(201).json({
        message: `${result.imported} ${definition.label} imported`,
        data: result,
      });
    } catch (error) {
      await audit(
        req as AuthRequest,
        auditOptions.module,
        auditOptions.failureAction,
        error instanceof Error ? error.message : "Unknown error",
        "ERROR",
      );
      return sendImportError(error, res, definition.uniqueColumn);
    }
  };

// Handler for GET .../import-template
export const createTemplateHandler =
  <T, K extends string>(definition: ImportDefinition<T, K>, fileName: string) =>
  async (_req: Request, res: Response) => {
    try {
      const workbook = buildTemplate(definition);

      res.setHeader("Content-Type", XLSX_MIME);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Could not create the template" });
      }
    }
  };