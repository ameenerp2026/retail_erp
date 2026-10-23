import { Request, Response } from "express";
import {
  createOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnitById,
  deleteOrganizationUnit,
  updateOrganizationUnit
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
    console.error("Failed to create organization unit", error);
     
  }
};

export const createOrgUnitController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("createOrganizationUnit", req.body);

    const result = await createOrganizationUnit(req.body);


     await logOrgUnitAction(
      req,
      "Created Organization Unit",
      `Created organization unit: ${result.organizationUnit ?? result.id}`
    );

    return res.status(201).json({
      message: "Organization unit saved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
      await logOrgUnitAction(
      req,
      "Organization Unit",
      `Failed to create organization unit: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );

    return res.status(500).json({
      message: "Failed to save organization unit",
      error: error instanceof Error ? error.message : error,
    });
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
      error: error?.message,
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
    return res.status(500).json({
      message: "Failed to fetch organization unit",
      error: error.message,
    });
  }
};


export const updateOrgUnitController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await updateOrganizationUnit(
      id,
      req.body
    );
    await logOrgUnitAction(
      req,
      "Updated Organization Unit",
      `Updated organization unit: ${result.organizationUnit ?? result.id}`
    );

    return res.status(200).json({
      message: "Organization unit updated successfully",
      data: result,
    });
  } catch (error: any) {
 await logOrgUnitAction(
      req,
      "Organization Unit",
      `Failed to update organization unit: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );

    return res.status(500).json({
      message: "Failed to update organization unit",
      error: error.message,
    });
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
      "Deleted Organization unit",
      `Deleted organization unit: ${result.organizationUnit ?? result.id}`
    );


    return res.status(200).json({
      message: "Organization unit deleted successfully",
      data: result,
    });
  } catch (error: any) {
     await logOrgUnitAction(
      req,
      "Organization Unit",
      `Failed to delete organization unit: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );
    return res.status(500).json({
      message: "Failed to delete organization unit",
      error: error.message,
    });
  }
};
