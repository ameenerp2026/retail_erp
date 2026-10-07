import { Request, Response } from "express";

import {createAccountingYear,getAccountingYear,getAccountingYearById} from '../../../services/admin/organization/AccountingYear.service.js'
import { AuthRequest } from "../../../middleware/auth.middleware.js";


export const createAccountingYearController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const result = await createAccountingYear(
      req.body,
      req.user.id
    );

    res.status(201).json({
      message: "Accounting Year created successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create Accounting Year",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getAccountingYearController = async (
  req: Request,
  res: Response
) => {
   try {
     const years = await getAccountingYear();

  if (!years) {
      return res.status(404).json({
        message: "Accounting year not found",
      });
    }

    return res.status(200).json({
      message: "Accounting year  fetched successfully",
      data: years,
    });
  }
   catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch Accounting year ",
      error: error.message,
    });
  }
   
}

export const getAccountingYearByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await getAccountingYearById(id);

    if (!result) {
      return res.status(404).json({
        message: "Accounting Year not found",
      });
    }

    return res.status(200).json({
      message: "Accounting Year fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch Accounting Year",
      error: error.message,
    });
  }
};
