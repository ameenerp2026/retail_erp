import prisma from "../../../config/prisma.js";
import { Prisma, type MasterStatus, type TaxConfig } from "@prisma/client";
import type { TaxGroup } from "../../../utils/inventory/productSetup/taxConfig.constants.js";

export type TaxConfigInput = {
  hsnCode: string;
  taxGroup: TaxGroup;
  gstRate: number;
  cessRate: number;
  effectiveFrom: Date;
  isDefault: boolean;
  status: MasterStatus;
};

type TaxConfigFilters = {
  search?: string;
  status?: MasterStatus;
  taxGroup?: TaxGroup;
};

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status });

const toDateOnly = (date: Date) => date.toISOString().slice(0, 10);

export const toTaxConfigResponse = (row: TaxConfig) => {
  const gstRate = row.gstRate.toNumber();

  return {
    id: row.id,
    taxId: `TAX-${String(row.id).padStart(3, "0")}`,
    hsnCode: row.hsnCode,
    taxGroup: row.taxGroup,
    gstRate,
    cessRate: row.cessRate.toNumber(),
    cgstRate: gstRate / 2,
    sgstRate: gstRate / 2,
    igstRate: gstRate,
    effectiveFrom: toDateOnly(row.effectiveFrom),
    isDefault: row.isDefault,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

export const taxConfigService = {
  async list(filters: TaxConfigFilters = {}) {
    const search = filters.search?.replace(/\s/g, "");

    const where: Prisma.TaxConfigWhereInput = {
      ...(search ? { hsnCode: { contains: search } } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.taxGroup ? { taxGroup: filters.taxGroup } : {}),
    };

    const rows = await prisma.taxConfig.findMany({
      where,
      orderBy: { id: "asc" },
    });

    return rows.map(toTaxConfigResponse);
  },

  async create(data: TaxConfigInput, createdBy: number) {
    if (data.isDefault && data.status === "INACTIVE") {
      throw httpError(400, "An inactive tax cannot be the default tax");
    }

    const row = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.taxConfig.updateMany({
          where: { isDefault: true },
          data: { isDefault: false, updatedById: createdBy },
        });
      }

      return tx.taxConfig.create({
        data: { ...data, createdById: createdBy },
      });
    });

    return toTaxConfigResponse(row);
  },

  async update(id: number, data: TaxConfigInput, updatedBy: number) {
    if (data.isDefault && data.status === "INACTIVE") {
      throw httpError(400, "An inactive tax cannot be the default tax");
    }

    const row = await prisma.$transaction(async (tx) => {
      const existing = await tx.taxConfig.findUnique({ where: { id } });
      if (!existing) throw httpError(404, "Tax configuration not found");

      if (data.isDefault) {
        await tx.taxConfig.updateMany({
          where: { isDefault: true, NOT: { id } },
          data: { isDefault: false, updatedById: updatedBy },
        });
      }

      return tx.taxConfig.update({
        where: { id },
        data: { ...data, updatedById: updatedBy },
      });
    });

    return toTaxConfigResponse(row);
  },

  async updateStatus(id: number, status: MasterStatus, updatedBy: number) {
    const existing = await prisma.taxConfig.findUnique({ where: { id } });
    if (!existing) throw httpError(404, "Tax configuration not found");

    if (status === "INACTIVE" && existing.isDefault) {
      throw httpError(
        400,
        "Cannot deactivate the default tax. Set another tax as default first.",
      );
    }

    const row = await prisma.taxConfig.update({
      where: { id },
      data: { status, updatedById: updatedBy },
    });

    return toTaxConfigResponse(row);
  },
};