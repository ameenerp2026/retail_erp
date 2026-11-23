import { Request, Response } from "express";
import type {
  CreateBusinessLocationInput,
  UpdateBusinessLocationInput,

} from '../../../types/businessLocation.types.js';
import { createBusinessLocation, getBusinessLocationData, getBusinessLocationById, deleteBusinessLoaction, updateBusinessLocation } from '../../../services/admin/organization/BusinessLocation.service.js'
import { audit } from "../../../utils/admin/securities/audit.utils.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";

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
    await audit(
      req as AuthRequest,
      "ORGANIZATION",
      "BUSINESS_LOCATION_CREATED",
      `Business location created: ${data.locationName}`
    );
    return res.status(201).json({
      success: true,
      message: 'Business location created successfully',
      data: location,
    });
  } catch (error: any) {
    await audit(
      req as AuthRequest,
      "ORGANIZATION",
      "BUSINESS_LOCATION_CREATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR"
    );
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

export const getBusinessLocationByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await getBusinessLocationById(id);

    if (!result) {
      return res.status(404).json({
        message: "Business location not found",
      });
    }

    return res.status(200).json({
      message: "Business location fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch business location",
      error: error.message,
    });
  }
};


export const deleteBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await deleteBusinessLoaction(id);
    await audit(
      req as AuthRequest,
      "ORGANIZATION",
      "BUSINESS_LOCATION_DELETED",
      `Business location deleted: ID ${id}`
    );
    return res.status(200).json({
      message: "Business location deleted successfully",
      data: result,
    });
  } catch (error: any) {
    await audit(
      req as AuthRequest,
      "ORGANIZATION",
      "BUSINESS_LOCATION_DELETE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR"
    );
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: statusCode === 404
        ? "Business location not found or already deleted"
        : "Failed to delete business location",
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
    await audit(
      req as AuthRequest,
      "ORGANIZATION",
      "BUSINESS_LOCATION_UPDATED",
      `Business location updated: ${req.body.locationName || `ID ${id}`}`
    );
    return res.status(200).json({
      message: "Business location updated successfully",
      data: result,
    });
  } catch (error: any) {
    await audit(
      req as AuthRequest,
      "ORGANIZATION",
      "BUSINESS_LOCATION_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR"
    );
    return res.status(500).json({
      message: "Failed to update business location",
      error: error.message,
    });
  }
};
