// utils/accountClassTransform.ts
import type { AccountClassApiResponse, AccountClassRecord } from '@/types/accountClass'
import { getGroupColor } from '@/utils/accountGroupColors'

function capitalize(status: 'active' | 'inactive'): 'Active' | 'Inactive' {
  return status === 'active' ? 'Active' : 'Inactive'
}

export function toAccountClassRecord(api: AccountClassApiResponse): AccountClassRecord {
  const groupColor = getGroupColor(api.accountGroup.rootGroupName)

  return {
    id: String(api.id),
    code: '', // no `code` field in the DB yet — see earlier note, placeholder for now
    name: api.className,
    accountGroupId: api.accountGroup.id,
    parentGroup: api.accountGroup.rootGroupName,
    parentGroupColor: groupColor.bgLight,
    description: api.description ?? '',
    linkedLedgers: api._count.ledgers,
    status: capitalize(api.status),
    lastUpdated: api.updatedAt,
    iconColor: groupColor.bg,
    iconBgColor: groupColor.bgLight,
  }
}

export function toAccountClassRecords(apiList: AccountClassApiResponse[]): AccountClassRecord[] {
  return apiList.map(toAccountClassRecord)
}