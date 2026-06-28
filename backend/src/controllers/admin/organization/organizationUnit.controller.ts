import { Request, Response } from "express";
import {
  createOrganizationUnit,
  getOrganizationUnit,
  deleteOrganizationUnit,
  updateOrganizationUnit
} from "../../services/organization/OrganizationUnit.service.js";

export const createOrgUnitController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const result = await createOrganizationUnit(req.body);

    return res.status(201).json({
      message: "Organization unit saved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to save organization unit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getOrgUnitByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await getOrganizationUnit(id);

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
      message: "Failed to fetch organization group",
      error: error.message,
    });
  }
};

export const updateOrgUnitController = async (
  req: Request,
  res: Response
) => {
    console.log('Body',res)
  try {
    
    const id = Number(req.params.id);

    const result = await updateOrganizationUnit(
      id,
      req.body
    );

    return res.status(200).json({
      message: "Organization unit updated successfully",
      data: result,
    });
  } catch (error: any) {
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
    console.log('Body',res)
  try {
    
    const id = Number(req.params.id);

    const result = await deleteOrganizationUnit(
      id,
      
    );

    return res.status(200).json({
      message: "Organization unit deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update organization unit",
      error: error.message,
    });
  }
}

