/** Formatting helpers shared by the Inventory module. */

export function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN')
}
