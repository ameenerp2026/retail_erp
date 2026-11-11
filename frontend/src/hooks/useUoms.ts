import {
  keepPreviousData,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { QueryKey } from '@tanstack/react-query'
import {
  createUom,
  getUoms,
  updateUomStatus,
} from '@/services/inventory/productSetup/uom.service'
import type {
  CreateUomPayload,
  Uom,
  UomFilters,
  UomStatus,
} from '@/services/inventory/productSetup/uom.service'

export const UOMS_QUERY_KEY = ['uoms']
const UOM_STATUS_MUTATION_KEY = ['update-uom-status']

type UpdateUomStatusVariables = {
  id: number
  status: UomStatus
}

type StatusUpdateContext = {
  previousQueries: Array<[QueryKey, Uom[] | undefined]>
}

export const useUoms = (filters: UomFilters) =>
  useQuery({
    queryKey: [...UOMS_QUERY_KEY, filters],
    queryFn: () => getUoms(filters),
    placeholderData: keepPreviousData,
  })

export const useCreateUom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUomPayload) => createUom(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UOMS_QUERY_KEY }),
  })
}

export const useUpdateUomStatus = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Uom,
    Error,
    UpdateUomStatusVariables,
    StatusUpdateContext
  >({
    mutationKey: UOM_STATUS_MUTATION_KEY,
    mutationFn: ({ id, status }) => updateUomStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: UOMS_QUERY_KEY })

      const previousQueries = queryClient.getQueriesData<Uom[]>({
        queryKey: UOMS_QUERY_KEY,
      })

      queryClient.setQueriesData<Uom[]>(
        { queryKey: UOMS_QUERY_KEY },
        (uoms) =>
          uoms?.map((uom) => (uom.id === id ? { ...uom, status } : uom)),
      )

      return { previousQueries }
    },
    onError: (_error, { id }, context) => {
      context?.previousQueries.forEach(([queryKey, previousUoms]) => {
        if (!previousUoms) return

        const previousStatus = previousUoms.find((uom) => uom.id === id)?.status
        const currentUoms = queryClient.getQueryData<Uom[]>(queryKey)
        if (!previousStatus || !currentUoms) return

        queryClient.setQueryData<Uom[]>(
          queryKey,
          currentUoms.map((uom) =>
            uom.id === id ? { ...uom, status: previousStatus } : uom,
          ),
        )
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: UOMS_QUERY_KEY }),
  })

  const pendingVariables = useMutationState({
    filters: { mutationKey: UOM_STATUS_MUTATION_KEY, status: 'pending' },
    select: (pendingMutation) => pendingMutation.state.variables,
  })
  const pendingStatusIds = pendingVariables.flatMap((variables) =>
    variables &&
    typeof variables === 'object' &&
    'id' in variables &&
    typeof variables.id === 'number'
      ? [variables.id]
      : [],
  )

  return { ...mutation, pendingStatusIds }
}
