import { env } from '@/config/env'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Single switch used by every service.
 * - Mock mode: return local mock data (optional short delay to mimic network)
 * - API mode: call the provided API function
 *
 * Pages/components should only call services — never import `@/mocks/*` directly.
 */
export async function fromMockOrApi<T>(
  mockData: T | (() => T | Promise<T>),
  apiCall: () => Promise<T>
): Promise<T> {
  if (env.useMocks) {
    if (env.mockDelayMs > 0) await delay(env.mockDelayMs)
    return typeof mockData === 'function'
      ? await (mockData as () => T | Promise<T>)()
      : mockData
  }
  return apiCall()
}
