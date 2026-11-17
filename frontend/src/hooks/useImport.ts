import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadImportFile } from '@/services/import.service'

type UseImportOptions = {
  importUrl: string
  invalidateKey: readonly unknown[]
}

export const useImport = ({ importUrl, invalidateKey }: UseImportOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadImportFile(importUrl, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invalidateKey }),
  })
}
