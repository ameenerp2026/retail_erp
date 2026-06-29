import { Request, Response } from "express";
import {
  createOrganizationGroup,
  getOrganizationGroupById,
  updateOrganizationGroup
} from "../../../services/admin/organization/organizationGroup.service.js";

export const createOrgGroupController = async (
  req: Request,
  res: Response
) => {
  console.log('createOrgGroupController',req.body)
  try {
    
    const result = await createOrganizationGroup(req.body);

    return res.status(201).json({
      message: "Organization group saved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to save organization group",
      error: error instanceof Error ? error.message : error,
    });
  }
};

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
    console.log('Body',res)
  try {
    
    const id = Number(req.params.id);

    const result = await updateOrganizationGroup(
      id,
      req.body
    );

    return res.status(200).json({
      message: "Organization group updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update organization group",
      error: error.message,
    });
  }
};