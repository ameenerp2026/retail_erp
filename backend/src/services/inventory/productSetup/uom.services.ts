import prisma from "../../../config/prisma.js";
import { Prisma } from "@prisma/client";

type UomStatus = "ACTIVE" | "INACTIVE";

type CreateUomInput = {
  name: string;
  shortName: string;
  gstUqcId: number;
  decimalPlaces: number;
  status?: UomStatus;
};

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status });

const gstUqcSelect = {
  id: true,
  code: true,
  description: true,
} satisfies Prisma.GstUqcSelect;

export const gstUqcService = {
  list() {
    return prisma.gstUqc.findMany({
      select: { id: true, code: true, description: true },
      orderBy: { code: "asc" },
    });
  },
};

export const uomService = {
  async list(filters?: { search?: string; status?: UomStatus }) {
    const where: Prisma.UomWhereInput = {
      ...(filters?.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { shortName: { contains: filters.search, mode: "insensitive" as const } },
              { gstUqc: { code: { contains: filters.search, mode: "insensitive" as const } } },
            ],
          }
        : {}),
      ...(filters?.status ? { status: filters.status } : {}),
    };

    return prisma.uom.findMany({
      where,
      orderBy: { id: "asc" },
      include: { gstUqc: { select: gstUqcSelect } },
    });
  },

  async create(data: CreateUomInput, createdBy: number) {
    const name = data.name?.trim();
    const shortName = data.shortName?.trim().toUpperCase();
    const { gstUqcId, decimalPlaces, status = "ACTIVE" } = data;

    if (!name) throw httpError(400, "UOM name is required");
    if (!shortName) throw httpError(400, "Short name is required");

    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0 || decimalPlaces > 3) {
      throw httpError(400, "Decimal places must be between 0 and 3");
    }

    if (!Number.isInteger(gstUqcId)) {
      throw httpError(400, "A valid GST UQC is required");
    }

    const gstUqc = await prisma.gstUqc.findUnique({
      where: { id: gstUqcId },
      select: { id: true },
    });
    if (!gstUqc) throw httpError(400, "Selected GST UQC does not exist");

    return prisma.uom.create({
      data: {
        name,
        shortName,
        gstUqcId,
        decimalPlaces,
        status,
        createdById: createdBy,
      },
      include: { gstUqc: { select: gstUqcSelect } },
    });
  },

  async update(id: number, status: UomStatus, updatedBy: number) {
    const existing = await prisma.uom.findUnique({ where: { id } });
    if (!existing) throw httpError(404, "UOM not found");

    return prisma.uom.update({
      where: { id },
      data: { status, updatedById: updatedBy },
      include: { gstUqc: { select: gstUqcSelect } },
    });
  },
};