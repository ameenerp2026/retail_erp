export type AccountClassRecord = {
  id: string
  code: string
  name: string
  parentGroup: string
  parentGroupColor: string  // tailwind bg color
  description: string
  linkedLedgers: number
  status: 'Active' | 'Inactive'
  lastUpdated: string
  iconColor: string  // tailwind bg color for icon
  iconBgColor?: string  // optional tailwind bg color for icon background
}