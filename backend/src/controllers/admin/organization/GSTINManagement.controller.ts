import { Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import {
  createGST,
  getGSTDetails,
} from "../../../services/admin/organization/GSTINManagement.service.js";
import prisma from "../../../config/prisma.js";
import { getUserScopes } from "../../../utils/admin/securities/scope.helper.js";
import { canAccessScope } from "../../../utils/admin/securities/scope.authorization.js";

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


    const organizationUnitId = Number(req.body.organizationUnit?.connect?.id);

    if (!Number.isInteger(organizationUnitId)) {
      return res.status(400).json({
        message: "Valid organization unit is required",
      });
    }

    const unit = await prisma.organizationUnit.findUnique({
      where: { id: organizationUnitId },
      select: {
        id: true,
        organizationGroupId: true,
      },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Organization Unit not found",
      });
    }

    const scopes = await getUserScopes(req.user.id);

    const allowed = canAccessScope(
      scopes,
      unit.organizationGroupId,
      unit.id
    );

    if (!allowed) {
      return res.status(403).json({
        message: "You cannot manage GSTINs for this organization unit",
      });
    }

    const result = await createGST({
      ...req.body,
      createdById: req.user.id,
    });

    return res.status(201).json({
      message: "GST details saved successfully",
      data: result,

    });
  } catch (error) {
    console.error(error);

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
    const gstDetails = await getGSTDetails((req as AuthRequest).user!.id)

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