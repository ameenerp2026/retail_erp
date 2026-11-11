import apiClient from '@/services/apiClient'

export interface GstUqc {
  id: number
  code: string
  description: string
}

interface ApiResponse<T> {
  message: string
  data: T
}

export const getGstUqcs = async (): Promise<GstUqc[]> => {
  const response = await apiClient.get<ApiResponse<GstUqc[]>>(
    '/api/productSetup/uom/gst-uqcs',
  )

  return response.data.data
}
