import prisma from "../../../config/prisma.js";
import { TAX_GROUPS } from "../../../utils/inventory/productSetup/taxConfig.constants.js";
import { parseTaxConfigInput } from "../../../utils/inventory/productSetup/taxConfig.validation.js";
import type { ImportDefinition } from "../../../utils/imports/import.types.js";
import type { TaxConfigInput } from "./taxConfig.services.js";

type TaxImportKey = "hsnCode" | "taxGroup" | "gstRate" | "cessRate" | "effectiveFrom";

export const taxConfigImport: ImportDefinition<TaxConfigInput, TaxImportKey> = {
  label: "tax configurations",
  sheetName: "Tax Configuration",
  maxRows: 1000,

  // 1. Which Excel columns, and how to read them
  columns: [
    { key: "hsnCode", header: "HSN Code", kind: "text", width: 14 },
    { key: "taxGroup", header: "Tax Group", kind: "text", width: 14, options: TAX_GROUPS },
    { key: "gstRate", header: "GST %", kind: "percent", width: 10 },
    { key: "cessRate", header: "CESS %", kind: "percent", width: 10 },
    { key: "effectiveFrom", header: "Effective Date", kind: "date", width: 16 },
  ],

  // 2. What the Instructions tab says
  instructions: [
    ["HSN Code", "4, 6 or 8 digits. Spaces are allowed and removed."],
    ["Tax Group", TAX_GROUPS.join(", ")],
    ["GST %", "0 to 100, up to 2 decimals. Type 18 for 18%."],
    ["CESS %", "Optional, 0 to 100. Leave empty for 0."],
    ["Effective Date", "A date, for example 2026-11-17."],
    ["Rules", "EXEMPT rows need 0 GST and 0 CESS. HSN codes must be new. Max 1,000 rows."],
    ["Default Tax", "Set on the Tax screen, not in this file."],
  ],

  // 3. Check one row, using the SAME rules as the form
  parseRow: (raw) =>
    parseTaxConfigInput({
      ...raw,
      taxGroup: raw.taxGroup.toUpperCase(), // "standard" → "STANDARD"
      isDefault: false,                     // never set default from a file
      status: "ACTIVE",
    }),

  // 4. What makes a row a duplicate
  uniqueKey: (row) => row.hsnCode,
  uniqueColumn: "HSN Code",

  // 5. Which HSN codes already exist, in one query
  findExisting: async (hsnCodes) => {
    const rows = await prisma.taxConfig.findMany({
      where: { hsnCode: { in: hsnCodes } },
      select: { hsnCode: true },
    });
    return rows.map((row) => row.hsnCode);
  },

  // 6. Save all rows in one statement
  save: async (rows, userId) => {
    const result = await prisma.taxConfig.createMany({
      data: rows.map((row) => ({ ...row, createdById: userId })),
    });
    return result.count;
  },
};