export const httpError = (
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
) => Object.assign(new Error(message), { status, ...extra });