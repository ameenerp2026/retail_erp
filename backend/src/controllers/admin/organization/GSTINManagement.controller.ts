import { Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import {
  createGST,
  getGSTDetails,
} from "../../../services/admin/organization/GSTINManagement.service.js";
import { createAuditLog } from "../../../services/admin/userLogs.service.js";

const logGSTINMngtAction = async (
  req: AuthRequest,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {
  const user = (req as AuthRequest).user;
  try {
    await createAuditLog({
      level,
      action,
      module: "GSTIN Management",
      userId: req.user?.id ?? null,
      userName: req.user?.email ?? null,
      description,
      ipAddress: req.ip,
    })
  } catch (error) {
    console.log("Failed to create GST audit log", error);

  }

}

export const creategstDetailsController = async (
  req: AuthRequest,
  res: Response
) => {
  console.log('createGST', req.body)
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await createGST({
      ...req.body,
      createdById: req.user.id,
    });

    await logGSTINMngtAction(req,
      "CREATED GST_DETAILS",
      `GST details created: ID ${result.id}`,
      "SUCCESS"
    )

    return res.status(201).json({
      message: "GST details saved successfully",
      data: result,

    });
  } catch (error) {
    console.error(error);
    await logGSTINMngtAction(
      req,
      "GSTIN Management",
      `Failed to create GST details: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    );
    return res.status(500).json({
      message: "Failed to save GST details",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getGSTDetailsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const gstDetails = await getGSTDetails()

    if (!gstDetails) {
      res.status(404).json({
        message: 'GST details not found',
      })
      return
    }

    res.status(200).json({
      message: 'GST details fetched successfully',
      data: gstDetails,
    })
  } catch (error: any) {
    console.error('Get GST details error:', error)

    res.status(500).json({
      message: 'Failed to fetch GST details',
      error: error?.message,
    })
  }
}