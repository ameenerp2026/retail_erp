import apiClient from '@/services/apiClient'

export type ImportRowError = { row: number; column: string; message: string }
export type ImportErrorResponse = { message: string; errors?: ImportRowError[] }

export type ImportSuccessResponse = {
  message: string
  data: { imported: number }
}

export const uploadImportFile = async (
  url: string,
  file: File,
): Promise<ImportSuccessResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<ImportSuccessResponse>(url, formData)
  return response.data
}

export const downloadImportTemplate = async (
  url: string,
  fileName: string,
): Promise<void> => {
  const response = await apiClient.get<Blob>(url, { responseType: 'blob' })
  const objectUrl = URL.createObjectURL(response.data)
  const link = document.createElement('a')

  try {
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
  } finally {
    link.remove()
    URL.revokeObjectURL(objectUrl)
  }
}
