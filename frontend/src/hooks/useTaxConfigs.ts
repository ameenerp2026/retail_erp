import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTaxConfig,
  getTaxConfigs,
  updateTaxConfig,
  updateTaxConfigStatus,
} from '@/services/inventory/productSetup/taxConfig.service'
import type {
  TaxConfig,
  TaxConfigFilters,
  TaxConfigPayload,
  TaxStatus,
} from '@/services/inventory/productSetup/taxConfig.service'

export const TAX_CONFIGS_QUERY_KEY = ['tax-configs']

export const useTaxConfigs = (filters: TaxConfigFilters) =>
  useQuery({
    queryKey: [...TAX_CONFIGS_QUERY_KEY, filters],
    queryFn: () => getTaxConfigs(filters),
    placeholderData: keepPreviousData,
  })

export const useCreateTaxConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TaxConfigPayload) => createTaxConfig(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAX_CONFIGS_QUERY_KEY }),
  })
}

export const useUpdateTaxConfig = () => {
  const queryClient = useQueryClient()

  return useMutation<TaxConfig, Error, { id: number; payload: TaxConfigPayload }>({
    mutationFn: ({ id, payload }) => updateTaxConfig(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAX_CONFIGS_QUERY_KEY }),
  })
}

export const useUpdateTaxConfigStatus = () => {
  const queryClient = useQueryClient()

  return useMutation<TaxConfig, Error, { id: number; status: TaxStatus }>({
    mutationFn: ({ id, status }) => updateTaxConfigStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAX_CONFIGS_QUERY_KEY }),
  })
}
