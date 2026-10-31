import { Request, Response } from "express";
import {
  createOrganizationGroup,
  getOrganizationGroup,
  getOrganizationGroupById,
  updateOrganizationGroup
} from "../../../services/admin/organization/organizationGroup.service.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { createAuditLog } from "../../../services/admin/userLogs.service.js";


const logOrgGroupAction = async (req: Request,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {

  try {
    const user = (req as AuthRequest).user;
    await createAuditLog({
      level,
      action,
      module: "Organization Group",
      userId: user?.id ?? null,
      userName: user?.email ?? null,
      description,
      ipAddress: req.ip,
    });

  } catch (error) {
    console.error("Failed to create Organization Group audit log", error);
  }
}


export const createOrgGroupController = async (
  req: Request,
  res: Response
) => {
  console.log('createOrgGroupController', req.body)
  try {

    const result = await createOrganizationGroup(req.body);
    await logOrgGroupAction(
      req,
      "CREATED ORGANIZATION_GROUP",
      "Organization group created successfully",
      "SUCCESS"
    );
    return res.status(201).json({
      message: "Organization group saved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    await logOrgGroupAction(
      req,
      "Organization Group",
      `Failed to create Organization Group: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );
    return res.status(500).json({
      message: "Failed to save organization group",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getOrgGroupController = async (
  req: Request,
  res: Response
) => {
  try {
    const groups = await getOrganizationGroup();

    if (!groups) {
      return res.status(404).json({
        message: "Organization group not found",
      });
    }

    return res.status(200).json({
      message: "Organization group fetched successfully",
      data: groups,
    });
  }
  catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch organization group",
      error: error.message,
    });
  }

}
export const getOrgGroupByIdController = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const result = await getOrganizationGroupById(id);

    if (!result) {
      return res.status(404).json({
        message: "Organization group not found",
      });
    }

    return res.status(200).json({
      message: "Organization group fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch organization group",
      error: error.message,
    });
  }
};

export const updateOrgGroupController = async (
  req: Request,
  res: Response
) => {
  console.log('Body', res)
  try {

    const id = Number(req.params.id);

    const result = await updateOrganizationGroup(
      id,
      req.body
    );
    await logOrgGroupAction(
      req,
      "UPDATED ORGANIZATION_GROUP",
      `Organization group updated: ID ${id}`,
      "SUCCESS"
    );
    return res.status(200).json({
      message: "Organization group updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error)
    await logOrgGroupAction(
      req,
      "Organization Group",
      `Failed to update Organization Group ID ${req.params.id}: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );
    return res.status(500).json({
      message: "Failed to update organization group",
      error: error.message,
    });
  }
};