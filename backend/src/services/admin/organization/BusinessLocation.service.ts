
import prisma from '../../../config/prisma.js';
import type {
  CreateBusinessLocationInput,
  UpdateBusinessLocationInput,
} from '../../../types/businessLocation.types.js';

export async function createBusinessLocation(data: CreateBusinessLocationInput) {

    const businessLocation = await prisma.businessLocation.create({
        data: {
            locationName: data.locationName,    
        
      parentOrganizationUnit: {
        connect: {
          id: data.parentOrganizationUnitId,
        },
      },
        locationType: data.locationType,
        businessCategory: data.businessCategory,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        landmark: data.landmark,
        city: data.city,  
        state: data.state,
        country: data.country,
        pinCode: data.pinCode,
        contactPerson: data.contactPerson,  
        phoneNumber: data.phoneNumber,
        email: data.email,
        emergencyContact: data.emergencyContact, 
       linkedGSTIN: {
        connect: {
          id: data.linkedGSTINId,
        },
      },
        registrationType: data.registrationType,
        defaultBillingLocation: data.defaultBillingLocation,    
    defaultStockLocation: data.defaultStockLocation,
    allowSales: data.allowSales,
    allowPurchase: data.allowPurchase,      

    allowInventory: data.allowInventory,
    allowDispatch: data.allowDispatch,
    allowPOS: data.allowPOS,
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

  }

  export const getBusinessLocationData = async () => {
  return prisma.businessLocation.findMany({
    orderBy: { updatedAt: "desc" },
  });
};



            

