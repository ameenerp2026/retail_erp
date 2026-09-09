import { Request, Response } from "express";
import { ewaybillService, TRANSPORT_MODES } from "../../../services/admin/utilities/EwayBill.service.js";

// Function to fetch dropdown/lookup + reference data for the e-way bill form
export const getFormOptionsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await ewaybillService.getFormOptions();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch e-way bill form options",
    });
  }
};

// Function to create a new e-way bill
export const createEWayBillHandler = async (req: Request, res: Response) => {
  const {
    transactionType,
    supplyType,
    documentDate,
    sellerGstProfileId,
    toGstin,
    hsnCode,
    taxableValue,
    vehicleNumber,
    transportMode,
    distanceKm,
  } = req.body;

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
  if (!hsnCode?.trim()) {
    errors.hsnCode = ["Item HSN Code is required"];
  }
  if (typeof taxableValue !== "number" || taxableValue <= 0) {
    errors.taxableValue = ["Taxable Value must be a positive number"];
  }
  if (!vehicleNumber?.trim()) {
    errors.vehicleNumber = ["Vehicle Number is required"];
  }
  if (!transportMode || !TRANSPORT_MODES.some((m) => m.value === transportMode)) {
    errors.transportMode = ["Mode of Transport must be one of the listed options"];
  }
  if (!Number.isInteger(distanceKm) || distanceKm <= 0) {
    errors.distanceKm = ["Distance (km) must be a positive whole number"];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await ewaybillService.createEWayBill(req.body, userId);

    return res.status(201).json({
      success: true,
      message: "E-Way Bill created successfully",
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
      return res.status(422).json({ errors: { hsnCode: [err.message] } });
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