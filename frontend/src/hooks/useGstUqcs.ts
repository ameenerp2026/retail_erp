import { useQuery } from '@tanstack/react-query'
import { getGstUqcs } from '@/services/inventory/productSetup/gstUqc.service'

export const useGstUqcs = () =>
  useQuery({
    queryKey: ['gst-uqcs'],
    queryFn: getGstUqcs,
    staleTime: 60 * 60 * 1000,
  })
