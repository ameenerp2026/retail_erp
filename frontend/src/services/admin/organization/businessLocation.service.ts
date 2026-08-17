import apiClient from '@/services/apiClient'
import type { businessLocationFormData } from '@/components/forms/validate.schema'

const buildPayload = (data: businessLocationFormData) => ({
  locationName: data.locationName,
  parentOrganizationUnitId: Number(data.parentOrganizationUnit),

  locationType: data.locationType,
  businessCategory: data.businessCategory,

  addressLine1: data.addressLine1,
  addressLine2: data.addressLine2 || undefined,
  landmark: data.landmark || undefined,

  city: data.city,
  state: data.state,
  country: data.country,
  pinCode: data.pinCode,

  contactPerson: data.contactPerson,
  phoneNumber: data.phoneNumber || undefined,
  email: data.email || undefined,
  emergencyContact: data.emergencyContact || undefined,

  linkedGSTINId: Number(data.linkedGSTIN),
  registrationType: data.registrationType,

  defaultBillingLocation: data.defaultBillingLocation ?? false,
  defaultStockLocation: data.defaultStockLocation ?? false,

  allowSales: data.allowSales ?? false,
  allowPurchase: data.allowPurchase ?? false,
  allowInventory: data.allowInventory ?? false,
  allowDispatch: data.allowDispatch ?? false,
  allowPOS: data.allowPOS ?? false,
})

export const createBusinessLocation = async (
  data: businessLocationFormData
) => {
  const response = await apiClient.post(
    '/api/organization/businessLocation',
    buildPayload(data)
  )

  return response.data
}

export const updateBusinessLocation = async (
  id: number,
  data: businessLocationFormData
) => {
  const response = await apiClient.patch(
    `/api/organization/businessLocation/${id}`,
    buildPayload(data)
  )

  return response.data
}

export const deleteBusinessLocation = async (id: number) => {
  const response = await apiClient.delete(
    `/api/organization/businessLocation/${id}`
  )

  return response.data
}

export const getBusinessLocations = async () => {
  const response = await apiClient.get(
    '/api/organization/businessLocation'
  )

  return response.data.data
}

export const getBusinessLocationById = async (id: number) => {
  const response = await apiClient.get(
    `/api/organization/businessLocation/${id}`
  )

  return response.data.data
}