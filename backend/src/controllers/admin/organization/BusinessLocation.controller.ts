import { Request, Response } from "express";
import {
  createBusinessLocation,
  getBusinessLocationData,
  getBusinessLocationById,
  deleteBusinessLoaction,
  updateBusinessLocation,
  INDIAN_STATES,
} from "../../../services/admin/organization/BusinessLocation.service.js";
import { createAuditLog } from "../../../services/admin/userLogs.service.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import prisma from "../../../config/prisma.js";

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
      module: "Business Location",
      userId: req.user?.id ?? null,
      userName: req.user?.email ?? null,
      description,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Failed to create audit log for business location:", error);
  }
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, "");
  // Standard phone check: 10 to 15 digits
  return digits.length >= 10 && digits.length <= 15;
};

const isValidPinCode = (pin: string) => {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
};

const validateLocationInput = async (data: any, isUpdate = false) => {
  if (!data) {
    return { valid: false, status: 400, message: "Request body is required" };
  }

  // 1. Location Name (BL-32)
  if (!isUpdate || data.locationName !== undefined) {
    if (!data.locationName || !String(data.locationName).trim()) {
      return {
        valid: false,
        status: 400,
        message: "Location name is required and cannot be blank",
      };
    }
  }

  // 2. Parent Org Unit Existence (BL-36)
  if (!isUpdate || data.parentOrganizationUnitId !== undefined) {
    const parentId = Number(data.parentOrganizationUnitId);
    if (!parentId || isNaN(parentId)) {
      return {
        valid: false,
        status: 400,
        message: "Parent organization unit is required",
      };
    }
    const parentUnit = await prisma.organizationUnit.findUnique({
      where: { id: parentId },
    });
    if (!parentUnit) {
      return {
        valid: false,
        status: 404,
        message: `Parent Organization Unit with ID ${parentId} does not exist`,
      };
    }
  }

  // 3. Linked GSTIN Existence (BL-36)
  if (!isUpdate || data.linkedGSTINId !== undefined) {
    const gstinId = Number(data.linkedGSTINId);
    if (gstinId && !isNaN(gstinId)) {
      const gstin = await prisma.gSTIN.findUnique({
        where: { id: gstinId },
      });
      if (!gstin) {
        return {
          valid: false,
          status: 404,
          message: `Linked GSTIN with ID ${gstinId} does not exist`,
        };
      }
    }
  }

  // 4. Email validation (BL-33)
  if (data.email && String(data.email).trim()) {
    if (!isValidEmail(String(data.email).trim())) {
      return {
        valid: false,
        status: 400,
        message: "Invalid email address format",
      };
    }
  }

  // 5. Phone & Emergency Contact (BL-34)
  if (data.phoneNumber && String(data.phoneNumber).trim()) {
    if (!isValidPhone(String(data.phoneNumber).trim())) {
      return {
        valid: false,
        status: 400,
        message: "Invalid phone number. Must contain at least 10 digits",
      };
    }
  }
  if (data.emergencyContact && String(data.emergencyContact).trim()) {
    if (!isValidPhone(String(data.emergencyContact).trim())) {
      return {
        valid: false,
        status: 400,
        message: "Invalid emergency contact number. Must contain at least 10 digits",
      };
    }
  }

  // 6. Pincode validation (BL-35)
  if (!isUpdate || data.pinCode !== undefined) {
    if (!data.pinCode || !isValidPinCode(String(data.pinCode))) {
      return {
        valid: false,
        status: 400,
        message: "Invalid PIN Code. Must be exactly 6 digits starting with 1-9",
      };
    }
  }

  // 7. Country and State Validation (BL-40)
  if (!isUpdate || data.country !== undefined || data.state !== undefined) {
    const country = String(data.country || "IN").trim().toUpperCase();
    const state = String(data.state || "").trim();

    if (country === "IN" || country === "INDIA") {
      const stateUpper = state.toUpperCase();
      const isKnownState =
        INDIAN_STATES[stateUpper] !== undefined ||
        Object.values(INDIAN_STATES).some(
          (s) => s.toLowerCase() === state.toLowerCase()
        );
      if (!isKnownState) {
        return {
          valid: false,
          status: 400,
          message: `State "${state}" is not a valid state for country India`,
        };
      }
    } else {
      // If country is not India, verify state is not an Indian state code (e.g. country AO with state MH)
      if (INDIAN_STATES[state.toUpperCase()]) {
        return {
          valid: false,
          status: 400,
          message: `State "${state}" does not belong to country "${country}"`,
        };
      }
    }
  }

  return { valid: true };
};

export const createBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = await validateLocationInput(req.body, false);
    if (!validation.valid) {
      return res.status(validation.status || 400).json({
        success: false,
        message: validation.message,
      });
    }

    const location = await createBusinessLocation(req.body);

    await logOrgUnitAction(
      req,
      "CREATED BUSINESS_LOCATION",
      `business_location: ${req.body.locationName}`
    );

    return res.status(201).json({
      success: true,
      message: "Business location created successfully",
      data: location,
    });
  } catch (error: any) {
    console.error("Create Business Location Error:", error);
    await logOrgUnitAction(
      req,
      "FAILED_TO_CREATE_BUSINESS_LOCATION",
      `business_location: ${req.body?.locationName}`
    );
    const status = error.statusCode || (error.code === "P2003" || error.code === "P2025" ? 400 : 500);
    return res.status(status).json({
      success: false,
      message: error?.message || "Failed to create business location",
    });
  }
};

export const getBusinessLocationController = async (
  _req: Request,
  res: Response
) => {
  try {
    const locations = await getBusinessLocationData();

    return res.status(200).json({
      message: "Business locations fetched successfully",
      data: locations,
    });
  } catch (error: any) {
    console.error("Fetch Business Locations Error:", error);
    return res.status(500).json({
      message: "Failed to fetch business locations",
    });
  }
};

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
    console.error("Fetch Business Location By ID Error:", error);
    return res.status(500).json({
      message: "Failed to fetch business location",
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
    await logOrgUnitAction(
      req,
      "DELETED_BUSINESS_LOCATION",
      `business_location_id: ${id}`
    );
    return res.status(200).json({
      message: "Business location deleted successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    await logOrgUnitAction(
      req,
      "FAILED_TO_DELETE_BUSINESS_LOCATION",
      `business_location_id: ${req.params.id}`
    );
    return res.status(statusCode).json({
      message:
        statusCode === 404
          ? "Business location not found or already deleted"
          : "Failed to delete business location",
    });
  }
};

export const updateBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const validation = await validateLocationInput(req.body, true);
    if (!validation.valid) {
      return res.status(validation.status || 400).json({
        success: false,
        message: validation.message,
      });
    }

    const result = await updateBusinessLocation(id, req.body);
    await logOrgUnitAction(
      req,
      "UPDATED_BUSINESS_LOCATION",
      `business_location: ${req.body.locationName}`
    );
    return res.status(200).json({
      message: "Business location updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update Business Location Error:", error);
    await logOrgUnitAction(
      req,
      "FAILED_TO_UPDATE_BUSINESS_LOCATION",
      `business_location: ${req.body?.locationName}`
    );
    const status = error.statusCode || (error.code === "P2003" || error.code === "P2025" ? 400 : 500);
    return res.status(status).json({
      message: error?.message || "Failed to update business location",
    });
  }
};
