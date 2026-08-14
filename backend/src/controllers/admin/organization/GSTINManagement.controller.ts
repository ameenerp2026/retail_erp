import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import {
 createGST,
  getGSTDetails,
} from "../../../services/admin/organization/GSTINManagement.service.js";

export const creategstDetailsController = async (
  req: AuthRequest,
  res: Response
) => {
  console.log('createGST',req.body)
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
) => {
   try {
     const gstDetails = await getGSTDetails();

  if (!gstDetails) {
      return res.status(404).json({
        message: "GST details not found",
      });
    }

    return res.status(200).json({
      message: "GST details fetched successfully",
      data: gstDetails,
    });
  }
   catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch GST details",
      error: error.message,
    });
  }
   
}