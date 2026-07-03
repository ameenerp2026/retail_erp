import { Request, Response } from "express";
import {
  createFinanceMonth,
  getFinanceMonths,
  getFinanceMonthById,
  updateFinanceMonth,
  deleteFinanceMonth,
} from "../../../services/admin/organization/FinanceMonth.service.js";

export const createFinanceMonthController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const result = await createFinanceMonth(req.body);

    return res.status(201).json({
      message: "Finance Month unit saved successfully",
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

export const getFinanceMonthsController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await getFinanceMonths();

    if (!result) {
      return res.status(404).json({
        message: "Finance data  not found",
      });
    }

    return res.status(200).json({
      message: "Finance data fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch organization group",
      error: error.message,
    });
  }
};

export const getFinanceMonthByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await getFinanceMonthById(id);

    if (!result) {
      return res.status(404).json({
        message: "Finance data not found",
      });
    }

    return res.status(200).json({
      message: "Finance Data fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch organization group",
      error: error.message,
    });
  }
};

export const updateFinanceMonthController = async (
  req: Request,
  res: Response
) => {
    console.log('Body',res)
  try {
    
    const id = Number(req.params.id);

    const result = await updateFinanceMonth(
      id,
      req.body
    );

    return res.status(200).json({
      message: "Finance  data updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update finance data",
      error: error.message,
    });
  }
};

export const deleteFinanceMonthController = async (
  req: Request,
  res: Response
) => {
    console.log('Body',res)
  try {
    
    const id = Number(req.params.id);

    const result = await deleteFinanceMonth(
      id,
      
    );

    return res.status(200).json({
      message: "Finance data  deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to delete finance data",
      error: error.message,
    });
  }
}

