/**
 * Central env for API vs mock switching.
 *
 * VITE_USE_MOCKS=true  → services return mock data (default in DEV)
 * VITE_USE_MOCKS=false → services call the real API
 * VITE_API_BASE_URL    → axios base URL (default http://localhost:5000)
 */
function readFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback
  return value === 'true' || value === '1'
}

export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000',
  useMocks: readFlag(
    import.meta.env.VITE_USE_MOCKS as string | undefined,
    import.meta.env.DEV
  ),
  mockDelayMs: Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 200),
} as const
