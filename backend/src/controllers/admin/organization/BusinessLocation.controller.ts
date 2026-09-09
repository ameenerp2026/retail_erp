import { Request, Response } from "express";
import type {
  CreateBusinessLocationInput,
  UpdateBusinessLocationInput,
  
} from '../../../types/businessLocation.types.js';
import {createBusinessLocation,getBusinessLocationData,deleteBusinessLoaction,updateBusinessLocation} from '../../../services/admin/organization/BusinessLocation.service.js'
import { updateOrganizationUnit } from "../../../services/admin/organization/OrganizationUnit.service.js";

export const createBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = req.body as CreateBusinessLocationInput;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required',
      });
    }

    const location = await createBusinessLocation(data);

    return res.status(201).json({
      success: true,
      message: 'Business location created successfully',
      data: location,
    });
  } catch (error: any) {
    console.error('Create Business Location Error:', error);

    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create business location',
    });
  }
}

export const getBusinessLocationController = async (
  req: Request,
  res: Response
) => {
   try {
     const location = await getBusinessLocationData();

  if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    return res.status(200).json({
      message: "Business locations fetched successfully",
      data: location,
    });
  }
   catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch business locations",
      error: error.message,
    });
  }
   
}

export const deleteBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await deleteBusinessLoaction(
      id
    );

    return res.status(200).json({
      message: "Business location deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to delete business location",
      error: error.message,
    });
  }
}

export const updateBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await updateBusinessLocation(
      id,
      req.body
    );

    return res.status(200).json({
      message: "Business location updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update business location",
      error: error.message,
    });
  }
};
