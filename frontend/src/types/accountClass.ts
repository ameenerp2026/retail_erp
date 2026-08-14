export type AccountClassStatus = 'active' | 'inactive'

export type CreateAccountClassRequest = {
  className: string
  accountGroupId: number
  description?: string | null
  status?: AccountClassStatus
}
// Raw shape from GET /api/finance/account-classes
export type AccountClassApiResponse = {
  id: number
  className: string
  description: string | null
  status: AccountClassStatus
  updatedAt: string
  accountGroup: {
    id: number
    rootGroupName: string
  }
  _count: { ledgers: number }
}

// Transformed for the table UI (colors added client-side)
export type AccountClassRecord = {
  id: string
  code: string
  name: string
  accountGroupId: number
  parentGroup: string
  parentGroupColor: string
  description: string
  linkedLedgers: number
  status: 'Active' | 'Inactive'
  lastUpdated: string
  iconColor: string
  iconBgColor?: string
}
export type UpdateAccountClassRequest = CreateAccountClassRequest