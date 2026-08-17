// types/businessLocation.types.ts
import { LocationType, BusinessCategory, RegistrationType, LocationStatus } from '@prisma/client';

export interface CreateBusinessLocationInput {
  locationName: string;
  parentOrganizationUnitId: number;
  locationType: LocationType;
  businessCategory: BusinessCategory;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  contactPerson: string;
  phoneNumber?: string;
  email?: string;
  emergencyContact?: string;
  linkedGSTINId: number;
  registrationType: RegistrationType;
  defaultBillingLocation?: boolean;
  defaultStockLocation?: boolean;
  allowSales?: boolean;
  allowPurchase?: boolean;
  allowInventory?: boolean;
  allowDispatch?: boolean;
  allowPOS?: boolean;
}

export type UpdateBusinessLocationInput = Partial<CreateBusinessLocationInput> & {
  status?: LocationStatus;
};