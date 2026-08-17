import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getBusinessLocations,
  getBusinessLocationById,
  createBusinessLocation,
  updateBusinessLocation,
  deleteBusinessLocation,
} from '@/services/admin/organization/businessLocation.service'

import type { businessLocationFormData } from '@/components/forms/validate.schema'

export const BUSINESS_LOCATION_QUERY_KEY = [
  'business-locations',
]

export const useBusinessLocations = () => {
  return useQuery({
    queryKey: BUSINESS_LOCATION_QUERY_KEY,
    queryFn: getBusinessLocations,
  })
}

export const useBusinessLocation = (id?: number) => {
  return useQuery({
    queryKey: ['business-location', id],
    queryFn: () => getBusinessLocationById(id!),
    enabled: !!id,
  })
}

export const useCreateBusinessLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: businessLocationFormData
    ) => createBusinessLocation(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BUSINESS_LOCATION_QUERY_KEY,
      })
    },
  })
}

export const useUpdateBusinessLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: businessLocationFormData
    }) =>
      updateBusinessLocation(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: BUSINESS_LOCATION_QUERY_KEY,
      })

      queryClient.invalidateQueries({
        queryKey: [
          'business-location',
          variables.id,
        ],
      })
    },
  })
}

export const useDeleteBusinessLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      deleteBusinessLocation(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BUSINESS_LOCATION_QUERY_KEY,
      })
    },
  })
}