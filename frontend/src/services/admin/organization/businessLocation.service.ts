import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'
import type { businessLocationFormData } from '@/components/forms/validate.schema'
import type { BusinessLocationRow } from '@/types/admin/organization/businessLocation'
import {
  getMockBusinessLocations,
  addMockBusinessLocation,
  updateMockBusinessLocation,
  deleteMockBusinessLocation,
} from '@/mocks/businessLocation.mock'

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
  status: data.status === false ? 'INACTIVE' : 'ACTIVE',
})

export const createBusinessLocation = async (
  data: businessLocationFormData
) => {
  return fromMockOrApi(
    () => {
      const code = data.locationName
        ? data.locationName.split(' ').map((w) => w[0]).join('').toUpperCase() + '-001'
        : 'BL-001'
      return addMockBusinessLocation({
        locationName: data.locationName,
        code,
        parentOrganizationUnitId: Number(data.parentOrganizationUnit) || 1,
        locationType: (data.locationType as any) || 'BRANCH',
        businessCategory: (data.businessCategory as any) || 'RETAIL',
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        landmark: data.landmark || null,
        city: data.city,
        state: data.state,
        country: data.country || 'IN',
        pinCode: data.pinCode,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        emergencyContact: data.emergencyContact || null,
        linkedGSTINId: Number(data.linkedGSTIN) || 1,
        registrationType: (data.registrationType as any) || 'REGULAR',
        defaultBillingLocation: !!data.defaultBillingLocation,
        defaultStockLocation: !!data.defaultStockLocation,
        allowSales: !!data.allowSales,
        allowPurchase: !!data.allowPurchase,
        allowInventory: !!data.allowInventory,
        allowDispatch: !!data.allowDispatch,
        allowPOS: !!data.allowPOS,
        status: data.status === false ? 'INACTIVE' : 'ACTIVE',
      })
    },
    async () => {
      const response = await apiClient.post(
        '/api/organization/businessLocation',
        buildPayload(data)
      )
      return response.data
    }
  )
}

export const updateBusinessLocation = async (
  id: number,
  data: businessLocationFormData
) => {
  return fromMockOrApi(
    () => {
      return updateMockBusinessLocation(id, {
        locationName: data.locationName,
        parentOrganizationUnitId: Number(data.parentOrganizationUnit) || 1,
        locationType: (data.locationType as any) || 'BRANCH',
        businessCategory: (data.businessCategory as any) || 'RETAIL',
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        landmark: data.landmark || null,
        city: data.city,
        state: data.state,
        country: data.country || 'IN',
        pinCode: data.pinCode,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        emergencyContact: data.emergencyContact || null,
        linkedGSTINId: Number(data.linkedGSTIN) || 1,
        registrationType: (data.registrationType as any) || 'REGULAR',
        defaultBillingLocation: !!data.defaultBillingLocation,
        defaultStockLocation: !!data.defaultStockLocation,
        allowSales: !!data.allowSales,
        allowPurchase: !!data.allowPurchase,
        allowInventory: !!data.allowInventory,
        allowDispatch: !!data.allowDispatch,
        allowPOS: !!data.allowPOS,
        status: data.status === false ? 'INACTIVE' : 'ACTIVE',
      })
    },
    async () => {
      const response = await apiClient.put(
        `/api/organization/businessLocation/${id}`,
        buildPayload(data)
      )
      return response.data
    }
  )
}

export const deleteBusinessLocation = async (id: number) => {
  return fromMockOrApi(
    () => {
      deleteMockBusinessLocation(id)
      return { success: true }
    },
    async () => {
      const response = await apiClient.delete(
        `/api/organization/businessLocation/${id}`
      )
      return response.data
    }
  )
}

export const getBusinessLocations = async (): Promise<BusinessLocationRow[]> => {
  return fromMockOrApi(
    getMockBusinessLocations,
    async () => {
      try {
        const response = await apiClient.get('/api/organization/businessLocation')
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          return response.data.data
        }
        return getMockBusinessLocations()
      } catch {
        return getMockBusinessLocations()
      }
    }
  )
}

export const getBusinessLocationById = async (id: number) => {
  return fromMockOrApi(
    () => {
      const found = getMockBusinessLocations().find((l) => l.id === id)
      return found || null
    },
    async () => {
      const response = await apiClient.get(
        `/api/organization/businessLocation/${id}`
      )
      return response.data.data
    }
  )
}
