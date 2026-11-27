import prisma from "../../../config/prisma.js";
import { Prisma } from "@prisma/client";

export const INDIAN_STATES: Record<string, string> = {
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CG: "Chhattisgarh",
  CT: "Chhattisgarh",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JH: "Jharkhand",
  JK: "Jammu and Kashmir",
  KA: "Karnataka",
  KL: "Kerala",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  MAL: "Maharashtra",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  OR: "Odisha",
  PB: "Punjab",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TS: "Telangana",
  TG: "Telangana",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UT: "Uttarakhand",
  UK: "Uttarakhand",
  WB: "West Bengal",
  AN: "Andaman and Nicobar Islands",
  CH: "Chandigarh",
  DH: "Dadra and Nagar Haveli and Daman and Diu",
  DD: "Daman and Diu",
  DN: "Dadra and Nagar Haveli",
  DL: "Delhi",
  LA: "Ladakh",
  LD: "Lakshadweep",
  PY: "Puducherry",
};

export const normalizeLocation = (loc: any) => {
  if (!loc) return null;

  const initials = loc.locationName
    ? loc.locationName
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3)
    : "LOC";
  const locationCode = `${initials}-${String(loc.id).padStart(3, "0")}`;

  let normalizedState = loc.state;
  if (loc.state) {
    const trimmed = String(loc.state).trim();
    const upper = trimmed.toUpperCase();
    if (INDIAN_STATES[upper]) {
      normalizedState = INDIAN_STATES[upper];
    } else {
      // Check if it already matches a value
      const match = Object.values(INDIAN_STATES).find(
        (v) => v.toLowerCase() === trimmed.toLowerCase()
      );
      if (match) normalizedState = match;
    }
  }

  // Omit businessCategory for BL-30
  const { businessCategory, ...rest } = loc;

  return {
    ...rest,
    state: normalizedState,
    locationCode,
    code: locationCode,
  };
};

const trimStr = (val: any) => (typeof val === "string" ? val.trim() : val);

export async function createBusinessLocation(data: any) {
  const statusValue =
    data.status === "INACTIVE" || data.status === false || data.status === "false"
      ? "INACTIVE"
      : "ACTIVE";

  const businessLocation = await prisma.businessLocation.create({
    data: {
      locationName: trimStr(data.locationName),
      parentOrganizationUnit: {
        connect: {
          id: Number(data.parentOrganizationUnitId),
        },
      },
      locationType: data.locationType || "BRANCH",
      businessCategory: data.businessCategory || "RETAIL",
      addressLine1: trimStr(data.addressLine1),
      addressLine2: trimStr(data.addressLine2) || null,
      landmark: trimStr(data.landmark) || null,
      city: trimStr(data.city),
      state: trimStr(data.state),
      country: trimStr(data.country) || "IN",
      pinCode: trimStr(data.pinCode),
      contactPerson: trimStr(data.contactPerson) || "",
      phoneNumber: trimStr(data.phoneNumber) || null,
      email: trimStr(data.email) || null,
      emergencyContact: trimStr(data.emergencyContact) || null,
      linkedGSTIN: {
        connect: {
          id: Number(data.linkedGSTINId),
        },
      },
      registrationType: data.registrationType || "REGULAR",
      defaultBillingLocation: !!data.defaultBillingLocation,
      defaultStockLocation: !!data.defaultStockLocation,
      allowSales: data.allowSales !== undefined ? !!data.allowSales : true,
      allowPurchase: data.allowPurchase !== undefined ? !!data.allowPurchase : true,
      allowInventory: data.allowInventory !== undefined ? !!data.allowInventory : true,
      allowDispatch: !!data.allowDispatch,
      allowPOS: data.allowPOS !== undefined ? !!data.allowPOS : true,
      status: statusValue,
    },
    include: {
      parentOrganizationUnit: {
        select: {
          id: true,
          organizationUnit: true,
        },
      },
      linkedGSTIN: {
        select: {
          id: true,
          gstin: true,
        },
      },
    },
  });

  return normalizeLocation(businessLocation);
}

export const getBusinessLocationData = async () => {
  const locations = await prisma.businessLocation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      parentOrganizationUnit: {
        select: {
          id: true,
          organizationUnit: true,
        },
      },
      linkedGSTIN: {
        select: {
          id: true,
          gstin: true,
        },
      },
    },
  });

  return locations.map(normalizeLocation);
};

export const getBusinessLocationById = async (id: number) => {
  const location = await prisma.businessLocation.findUnique({
    where: { id },
    include: {
      parentOrganizationUnit: {
        select: {
          id: true,
          organizationUnit: true,
        },
      },
      linkedGSTIN: {
        select: {
          id: true,
          gstin: true,
        },
      },
    },
  });

  return normalizeLocation(location);
};

export const deleteBusinessLoaction = async (id: number) => {
  try {
    return await prisma.businessLocation.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      const notFoundError: any = new Error("Business location not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    throw error;
  }
};

export const updateBusinessLocation = async (id: number, data: any) => {
  const updateData: any = {};

  if (data.locationName !== undefined) updateData.locationName = trimStr(data.locationName);
  if (data.parentOrganizationUnitId !== undefined) {
    updateData.parentOrganizationUnit = {
      connect: { id: Number(data.parentOrganizationUnitId) },
    };
  }
  if (data.locationType !== undefined) updateData.locationType = data.locationType;
  if (data.businessCategory !== undefined) updateData.businessCategory = data.businessCategory;
  if (data.addressLine1 !== undefined) updateData.addressLine1 = trimStr(data.addressLine1);
  if (data.addressLine2 !== undefined) updateData.addressLine2 = trimStr(data.addressLine2) || null;
  if (data.landmark !== undefined) updateData.landmark = trimStr(data.landmark) || null;
  if (data.city !== undefined) updateData.city = trimStr(data.city);
  if (data.state !== undefined) updateData.state = trimStr(data.state);
  if (data.country !== undefined) updateData.country = trimStr(data.country);
  if (data.pinCode !== undefined) updateData.pinCode = trimStr(data.pinCode);
  if (data.contactPerson !== undefined) updateData.contactPerson = trimStr(data.contactPerson) || "";
  if (data.phoneNumber !== undefined) updateData.phoneNumber = trimStr(data.phoneNumber) || null;
  if (data.email !== undefined) updateData.email = trimStr(data.email) || null;
  if (data.emergencyContact !== undefined) updateData.emergencyContact = trimStr(data.emergencyContact) || null;
  if (data.linkedGSTINId !== undefined) {
    updateData.linkedGSTIN = {
      connect: { id: Number(data.linkedGSTINId) },
    };
  }
  if (data.registrationType !== undefined) updateData.registrationType = data.registrationType;
  if (data.defaultBillingLocation !== undefined) updateData.defaultBillingLocation = !!data.defaultBillingLocation;
  if (data.defaultStockLocation !== undefined) updateData.defaultStockLocation = !!data.defaultStockLocation;
  if (data.allowSales !== undefined) updateData.allowSales = !!data.allowSales;
  if (data.allowPurchase !== undefined) updateData.allowPurchase = !!data.allowPurchase;
  if (data.allowInventory !== undefined) updateData.allowInventory = !!data.allowInventory;
  if (data.allowDispatch !== undefined) updateData.allowDispatch = !!data.allowDispatch;
  if (data.allowPOS !== undefined) updateData.allowPOS = !!data.allowPOS;

  if (data.status !== undefined) {
    updateData.status =
      data.status === "INACTIVE" || data.status === false || data.status === "false"
        ? "INACTIVE"
        : "ACTIVE";
  }

  const updated = await prisma.businessLocation.update({
    where: { id },
    data: updateData,
    include: {
      parentOrganizationUnit: {
        select: {
          id: true,
          organizationUnit: true,
        },
      },
      linkedGSTIN: {
        select: {
          id: true,
          gstin: true,
        },
      },
    },
  });

  return normalizeLocation(updated);
};
