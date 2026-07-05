import { Request, Response } from "express";

import {createAccountingYear,getAccountingYear} from '../../../services/admin/organization/AccountingYear.service.js'


export const createAccountingYearController = async (
  req: Request,
  res: Response
) => {
  console.log('createAccountingYearController',req.body)
  try {
    
    const result = await createAccountingYear(req.body);

    return res.status(201).json({
      message: "Accounting Year created successfully",
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

export const getAccountingYearController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await getAccountingYear(id);

    if (!result) {
      return res.status(404).json({
        message: "Organization group not found",
      });
    }

    return res.status(200).json({
      message: "Accounting Year fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch organization group",
      error: error.message,
    });
  }
};
