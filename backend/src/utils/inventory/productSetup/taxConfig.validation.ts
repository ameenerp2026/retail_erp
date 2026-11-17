import { TAX_GROUPS, isTaxGroup } from "./taxConfig.constants.js";
import type { TaxConfigInput } from "../../../services/inventory/productSetup/taxConfig.services.js";

export type TaxConfigField =
  | "hsnCode" | "taxGroup" | "gstRate" | "cessRate" | "effectiveFrom" | "isDefault" | "status";

export type ParseResult =
  | { ok: true; data: TaxConfigInput }
  | { ok: false; error: string; field: TaxConfigField };

const HSN_PATTERN = /^[0-9]{4}([0-9]{2}){0,2}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseId = (value: unknown): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseRate = (value: unknown, defaultValue?: number): number | null => {
  if (value === undefined || value === null || value === "") return defaultValue ?? null;
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

export const parseTaxConfigInput = (body: any): ParseResult => {
  const hsnCode = String(body?.hsnCode ?? "").replace(/\s/g, "");
  if (!HSN_PATTERN.test(hsnCode)) {
    return { ok: false, field: "hsnCode", error: "HSN/SAC code must be 4, 6 or 8 digits" };
  }

  const taxGroup = body?.taxGroup;
  if (!isTaxGroup(taxGroup)) {
    return { ok: false, field: "taxGroup", error: `Tax group must be one of: ${TAX_GROUPS.join(", ")}` };
  }

  const gstRate = parseRate(body?.gstRate);
  if (gstRate === null) {
    return { ok: false, field: "gstRate", error: "GST rate must be between 0 and 100, with up to 2 decimals" };
  }

  const cessRate = parseRate(body?.cessRate, 0);
  if (cessRate === null) {
    return { ok: false, field: "cessRate", error: "Cess rate must be between 0 and 100, with up to 2 decimals" };
  }

  if (taxGroup === "EXEMPT" && (gstRate !== 0 || cessRate !== 0)) {
    return { ok: false, field: "gstRate", error: "Exempt tax group must have 0% GST and 0% cess" };
  }

  const effectiveFrom = parseDate(body?.effectiveFrom);
  if (!effectiveFrom) {
    return { ok: false, field: "effectiveFrom", error: "Effective date must be a valid date in YYYY-MM-DD format" };
  }

  const isDefault = body?.isDefault ?? false;
  if (typeof isDefault !== "boolean") {
    return { ok: false, field: "isDefault", error: "isDefault must be true or false" };
  }

  const status = body?.status ?? "ACTIVE";
  if (status !== "ACTIVE" && status !== "INACTIVE") {
    return { ok: false, field: "status", error: "Status must be ACTIVE or INACTIVE" };
  }

  return {
    ok: true,
    data: { hsnCode, taxGroup, gstRate, cessRate, effectiveFrom, isDefault, status },
  };
};