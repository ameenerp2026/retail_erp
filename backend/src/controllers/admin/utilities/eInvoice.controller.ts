import { Request, Response } from "express";
import { einvoiceService } from "../../../services/admin/utilities/Einvoice.service.js";

// Function to fetch dropdown/lookup data for the e-invoice form
export const getFormOptionsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await einvoiceService.getFormOptions();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch e-invoice form options",
    });
  }
};

// Function to create a new e-invoice
export const createEInvoiceHandler = async (req: Request, res: Response) => {
  const { transactionType, supplyType, documentDate, sellerGstProfileId, toGstin, items } = req.body;

  const errors: Record<string, string[]> = {};

  if (!transactionType || !["outward", "inward"].includes(transactionType)) {
    errors.transactionType = ['Transaction Type must be "Outward" or "Inward"'];
  }
  if (!supplyType || !["b2b", "b2c", "d2c"].includes(supplyType)) {
    errors.supplyType = ["Supply Type must be one of the listed options"];
  }
  if (!documentDate || Number.isNaN(Date.parse(documentDate))) {
    errors.documentDate = ["Document Date is required and must be a valid date"];
  }
  if (!sellerGstProfileId) {
    errors.sellerGstProfileId = ["From GSTIN is required"];
  }
  if (!toGstin?.trim()) {
    errors.toGstin = ["To GSTIN is required"];
  }
  if (!Array.isArray(items) || items.length === 0) {
    errors.items = ["At least one line item is required"];
  } else {
    const itemErrors: string[] = [];
    items.forEach((item: any, idx: number) => {
      if (!item?.hsnCode) itemErrors.push(`Item ${idx + 1}: Item HSN Code is required`);
      if (typeof item?.taxableValue !== "number" || item.taxableValue <= 0) {
        itemErrors.push(`Item ${idx + 1}: Taxable Value must be a positive number`);
      }
    });
    if (itemErrors.length > 0) errors.items = itemErrors;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await einvoiceService.createEInvoice(req.body, userId);

    return res.status(201).json({
      success: true,
      message: "E-Invoice created successfully",
      data,
    });
  } catch (err: any) {
    if (err.code === "FUTURE_DATE") {
      return res.status(422).json({ errors: { documentDate: [err.message] } });
    }
    if (err.code === "INVALID_SELLER") {
      return res.status(422).json({ errors: { sellerGstProfileId: [err.message] } });
    }
    if (err.code === "INVALID_HSN") {
      return res.status(422).json({ errors: { items: [err.message] } });
    }
    if (err.code === "P2002") {
      return res.status(409).json({
        errors: { documentNumber: ["A document with this number already exists for this seller"] },
      });
    }
    if (err.code === "P2003") {
      return res.status(422).json({
        error: "One of the selected references (From GSTIN) does not exist",
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};