import { Request, Response } from "express";
import {
  createOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnitById,
  deleteOrganizationUnit,
  updateOrganizationUnit,
} from "../../../services/admin/organization/OrganizationUnit.service.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { createAuditLog } from "../../../services/admin/userLogs.service.js";

const logOrgUnitAction = async (
  req: AuthRequest,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {
  try {
    await createAuditLog({
      level,
      action,
      module: "Organization Unit",
      userId: req.user?.id ?? null,
      userName: req.user?.email ?? null,
      description,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Failed to log organization unit audit action:", error);
  }
};

const resolveErrorResponse = (error: any, fallbackMessage: string) => {
  console.error("Organization Unit Error:", error);

  if (error?.code === "P2003") {
    return {
      status: 409,
      message: "This unit is linked to GSTIN records and cannot be deleted",
    };
  }

  if (error?.code === "P2002") {
    return {
      status: 409,
      message: "An organization unit with this unique field already exists",
    };
  }

  if (error?.statusCode && error?.message) {
    return {
      status: error.statusCode,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: fallbackMessage,
  };
};

export const createOrgUnitController = async (req: Request, res: Response) => {
  try {
    const result = await createOrganizationUnit(req.body);

    await logOrgUnitAction(
      req,
      "CREATED ORG_UNIT",
      `org_unit: ${result.organizationUnit}`
    );

    return res.status(201).json({
      message: "Organization unit saved successfully",
      data: result,
    });
  } catch (error: any) {
    const { status, message } = resolveErrorResponse(
      error,
      "Failed to save organization unit"
    );

    await logOrgUnitAction(
      req,
      "Organization Unit",
      `Failed to create organization unit: ${message}`,
      "ERROR"
    );

    return res.status(status).json({ message });
  }
};

export const getOrgUnitController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const result = await getOrganizationUnit(req.user.id);

    res.status(200).json({
      message: "Organization units fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Get organization units error:", error);
    res.status(500).json({
      message: "Failed to fetch organization units",
    });
  }
};

export const getOrgUnitByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await getOrganizationUnitById(id);

    if (!result) {
      return res.status(404).json({
        message: "Organization unit not found",
      });
    }

    return res.status(200).json({
      message: "Organization unit fetched successfully",
      data: result,
    });
  } catch (error: any) {
    const { status, message } = resolveErrorResponse(
      error,
      "Failed to fetch organization unit"
    );
    return res.status(status).json({ message });
  }
};

export const updateOrgUnitController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await updateOrganizationUnit(id, req.body);
    await logOrgUnitAction(
      req,
      "UPDATED ORG_UNIT",
      `org_unit: ${result.organizationUnit}`
    );

    return res.status(200).json({
      message: "Organization unit updated successfully",
      data: result,
    });
  } catch (error: any) {
    const { status, message } = resolveErrorResponse(
      error,
      "Failed to update organization unit"
    );

    await logOrgUnitAction(
      req,
      "Organization Unit",
      `Failed to update organization unit: ${message}`,
      "ERROR"
    );

    return res.status(status).json({ message });
  }
};

export const deleteOrgUnitController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await deleteOrganizationUnit(id);

    await logOrgUnitAction(
      req,
      "DELETED ORG_UNIT",
      `org_unit: ${result.organizationUnit}`
    );

    return res.status(200).json({
      message: "Organization unit deleted successfully",
      data: result,
    });
  } catch (error: any) {
    const { status, message } = resolveErrorResponse(
      error,
      "Failed to delete organization unit"
    );

    await logOrgUnitAction(
      req,
      "Organization Unit",
      `Failed to delete organization unit: ${message}`,
      "ERROR"
    );

    return res.status(status).json({ message });
  }
};
