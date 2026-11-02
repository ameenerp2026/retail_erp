// Typed helper for axios-style API errors, replacing `error: any` callbacks.
export type ApiErrorPayload = {
  error?: string
  message?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const shaped = error as {
      response?: { data?: ApiErrorPayload }
      data?: ApiErrorPayload
    }
    const data = shaped.response?.data ?? shaped.data
    if (data) {
      const firstFieldError = data.errors
        ? Object.values(data.errors)[0]?.[0]
        : undefined
      return data.error || data.message || firstFieldError || fallback
    }
  }
  return fallback
}