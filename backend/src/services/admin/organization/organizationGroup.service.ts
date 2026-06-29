import prisma from "../../../config/prisma.js";

export const createOrganizationGroup = async (data: any) => {
  return prisma.organizationGroup.create({
    data: {
      shortName: data.shortName,
      financialYear: data.financialYear,
      currency: data.currency,

      companyName: data.companyName,
      cinNumber: data.cinNumber,
      panNumber: data.panNumber,
      email: data.email,
      phoneNumber: data.phoneNumber,
      website: data.website,
      address: data.address,

      state: data.state,
      country: data.country,
      pinCode: data.pinCode,
    },
  });
};

export const getOrganizationGroupById = async (id: number) => {
  return prisma.organizationGroup.findUnique({
    where: {
      id,
    },
  });
};

export const updateOrganizationGroup = async (
  id: number,
  data: any
) => {
  return prisma.organizationGroup.update({
    where: {
      id,
    },
    data: {
      shortName: data.shortName,
      logoUrl: data.logoUrl,
      financialYear: data.financialYear,
      currency: data.currency,

      companyName: data.companyName,
      cinNumber: data.cinNumber,
      panNumber: data.panNumber,
      email: data.email,
      phoneNumber: data.phoneNumber,
      website: data.website,
      address: data.address,

      state: data.state,
      country: data.country,
      pinCode: data.pinCode,
      status: data.status,
    },
  });
};