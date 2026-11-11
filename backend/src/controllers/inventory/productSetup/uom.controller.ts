import { Request, Response } from "express";
import { uomService,gstUqcService } from "../../../services/inventory/productSetup/uom.services.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { audit } from "../../../utils/admin/securities/audit.utils.js";

const handleError = (error: any, res: Response) => {
  if (error.code === "P2002") {
    return res.status(409).json({ message: "UOM short name or name already exists" });
  }
  if (error.status) return res.status(error.status).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
};




export const getGstUqcs = async (_req: Request, res: Response) => {
  try {
    const data = await gstUqcService.list();
    return res.status(200).json({ message: "GST UQCs fetched successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUOMS = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" && req.query.search.trim()
        ? req.query.search.trim()
        : undefined;

    const status =
      req.query.status === "ACTIVE" || req.query.status === "INACTIVE"
        ? req.query.status
        : undefined;

    const data = await uomService.list({ search, status });
    return res.status(200).json({ message: "UOMs fetched successfully", data });
  } catch (error) {
    return handleError(error, res);
  }
};

export const createUOMS = async (req: Request, res: Response) => {
  try {
    const shortName = String(req.body.shortName ?? "").trim().toUpperCase();
    const name = String(req.body.name ?? "").trim();
    const gstUqcId = Number(req.body.gstUqcId ?? NaN);
    const decimalPlaces = Number(req.body.decimalPlaces ?? NaN);
    const status = req.body.status ?? "ACTIVE";

    if (!/^[A-Z]{1,10}$/.test(shortName)) {
      return res.status(400).json({
        message: "Short name must be 1 to 10 letters (A-Z), no digits or symbols",
      });
    }
    if (!name || name.length > 50) {
      return res.status(400).json({ message: "Name is required, max 50 characters" });
    }
    if (!Number.isInteger(gstUqcId) || gstUqcId <= 0) {
      return res.status(400).json({ message: "A valid GST UQC is required" });
    }
    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0 || decimalPlaces > 3) {
      return res.status(400).json({ message: "Decimal places must be between 0 and 3" });
    }
    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const data = await uomService.create(
      { name, shortName, gstUqcId, decimalPlaces, status },
      (req as any).user.id,
    );

    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "UOM_CREATED",
      `Created UOM ${name} (${shortName})`,
    );

    return res.status(201).json({ message: "UOM created successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "UOM_CREATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};

export const updateUOM = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid UOM id" });
    }
    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const data = await uomService.update(id, status, (req as any).user.id);

    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "UOM_UPDATED",
      `UPDATED UOM (${data.name} set to ${status})`,
    );

    return res.status(200).json({ message: "UOM status updated successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "UOM_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};