import { Request, Response } from "express";

import { createAccountingYear, getAccountingYear, getAccountingYearById } from '../../../services/admin/organization/AccountingYear.service.js'
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { createAuditLog } from "../../../services/admin/userLogs.service.js";

const logAccountingYearAction = async (
  req: AuthRequest,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {
  try {
    await createAuditLog({
      level,
      action,
      module: "Accounting Year",
      userId: req.user?.id ?? null,
      userName: req.user?.email ?? null,
      description,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Failed to create accounting year audit log", error);
  }
};

export const createAccountingYearController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const result = await createAccountingYear(
      req.body,
      req.user.id
    );
    await logAccountingYearAction(
      req,
      "CREATED ACCOUNTING_YEAR",
      `Accounting Year created: ${result.yearName} (ID: ${result.id})`,
      "SUCCESS"
    );

    res.status(201).json({
      message: "Accounting Year created successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    await logAccountingYearAction(
      req,
      "Accounting Year",
      `Failed to create Accounting Year: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );
    res.status(500).json({
      message: "Failed to create Accounting Year",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAccountingYearController = async (
  req: Request,
  res: Response
) => {
  try {
    const years = await getAccountingYear();

    if (!years) {
      return res.status(404).json({
        message: "Accounting year not found",
      });
    }

    return res.status(200).json({
      message: "Accounting year  fetched successfully",
      data: years,
    });
  }
  catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch Accounting year ",
      error: error.message,
    });
  }

}

export const getAccountingYearByIdController = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const result = await getAccountingYearById(id);

    if (!result) {
      return res.status(404).json({
        message: "Accounting Year not found",
      });
    }

    return res.status(200).json({
      message: "Accounting Year fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch Accounting Year",
      error: error.message,
    });
  }
};
