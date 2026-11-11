import { Request, Response } from "express";
import {
  taxConfigService,
  type TaxConfigInput,
} from "../../../services/inventory/productSetup/taxConfig.services.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { audit } from "../../../utils/admin/securities/audit.utils.js";
import { TAX_GROUPS, isTaxGroup } from "../../../utils/inventory/productSetup/taxConfig.constants.js";

const HSN_PATTERN = /^[0-9]{4}([0-9]{2}){0,2}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type ParseResult =
  | { ok: true; data: TaxConfigInput }
  | { ok: false; error: string };

const handleError = (error: any, res: Response) => {
  if (error.code === "P2002") {
    return res.status(409).json({ message: "HSN code already exists" });
  }
  if (error.status) return res.status(error.status).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
};

const parseId = (value: unknown): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseRate = (value: unknown, defaultValue?: number): number | null => {
  if (value === undefined || value === null || value === "") {
    return defaultValue ?? null;
  }
  if (typeof value !== "number" && typeof value !== "string") return null;

  const rate = Number(value);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) return null;
  if (Number(rate.toFixed(2)) !== rate) return null;
  return rate;
};

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.toISOString().slice(0, 10) !== value) return null;
  return date;
};

const parseTaxConfigInput = (body: any): ParseResult => {
  const hsnCode = String(body?.hsnCode ?? "").replace(/\s/g, "");
  if (!HSN_PATTERN.test(hsnCode)) {
    return { ok: false, error: "HSN/SAC code must be 4, 6 or 8 digits" };
  }

  const taxGroup = body?.taxGroup;
  if (!isTaxGroup(taxGroup)) {
    return { ok: false, error: `Tax group must be one of: ${TAX_GROUPS.join(", ")}` };
  }

  const gstRate = parseRate(body?.gstRate);
  if (gstRate === null) {
    return { ok: false, error: "GST rate must be between 0 and 100, with up to 2 decimals" };
  }

  const cessRate = parseRate(body?.cessRate, 0);
  if (cessRate === null) {
    return { ok: false, error: "Cess rate must be between 0 and 100, with up to 2 decimals" };
  }

  if (taxGroup === "EXEMPT" && (gstRate !== 0 || cessRate !== 0)) {
    return { ok: false, error: "Exempt tax group must have 0% GST and 0% cess" };
  }

  const effectiveFrom = parseDate(body?.effectiveFrom);
  if (!effectiveFrom) {
    return { ok: false, error: "Effective date must be a valid date in YYYY-MM-DD format" };
  }

  const isDefault = body?.isDefault ?? false;
  if (typeof isDefault !== "boolean") {
    return { ok: false, error: "isDefault must be true or false" };
  }

  const status = body?.status ?? "ACTIVE";
  if (status !== "ACTIVE" && status !== "INACTIVE") {
    return { ok: false, error: "Status must be ACTIVE or INACTIVE" };
  }

  return {
    ok: true,
    data: { hsnCode, taxGroup, gstRate, cessRate, effectiveFrom, isDefault, status },
  };
};

export const getTaxConfigs = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" && req.query.search.trim()
        ? req.query.search.trim()
        : undefined;

    const status =
      req.query.status === "ACTIVE" || req.query.status === "INACTIVE"
        ? req.query.status
        : undefined;

    const taxGroup = isTaxGroup(req.query.taxGroup) ? req.query.taxGroup : undefined;

    const data = await taxConfigService.list({ search, status, taxGroup });
    return res.status(200).json({ message: "Tax configurations fetched successfully", data });
  } catch (error) {
    return handleError(error, res);
  }
};

export const createTaxConfig = async (req: Request, res: Response) => {
  try {
    const parsed = parseTaxConfigInput(req.body);
    if (!parsed.ok) return res.status(400).json({ message: parsed.error });

    const data = await taxConfigService.create(parsed.data, (req as any).user.id);

    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "TAX_CREATED",
      `Created tax ${data.taxId} (HSN ${data.hsnCode}, GST ${data.gstRate}%)`,
    );

    return res.status(201).json({ message: "Tax configuration created successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "TAX_CREATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};

export const updateTaxConfig = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid tax configuration id" });

    const parsed = parseTaxConfigInput(req.body);
    if (!parsed.ok) return res.status(400).json({ message: parsed.error });

    const data = await taxConfigService.update(id, parsed.data, (req as any).user.id);

    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "TAX_UPDATED",
      `Updated tax ${data.taxId} (HSN ${data.hsnCode}, GST ${data.gstRate}%)`,
    );

    return res.status(200).json({ message: "Tax configuration updated successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "TAX_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};

export const updateTaxConfigStatus = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid tax configuration id" });

    const { status } = req.body;
    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const data = await taxConfigService.updateStatus(id, status, (req as any).user.id);

    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "TAX_STATUS_UPDATED",
      `Set tax ${data.taxId} (HSN ${data.hsnCode}) to ${status}`,
    );

    return res.status(200).json({ message: "Tax status updated successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "PRODUCT_SETUP",
      "TAX_STATUS_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};