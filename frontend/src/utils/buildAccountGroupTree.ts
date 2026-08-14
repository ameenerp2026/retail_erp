import type { AccountGroupNode } from '@/types/accountGroup'

interface AccountGroupRow {
  id: number
  rootGroupName: string
  groupCode: string
  group: { groupName: string; groupCode: string }
  subGroup: { subGroupName: string; subGroupCode: string }
}

export function buildAccountGroupTree(rows: AccountGroupRow[]): AccountGroupNode[] {
  const groupMap = new Map<string, AccountGroupNode>()

  for (const row of rows) {
    const groupKey = row.group.groupCode
    const subGroupKey = `${groupKey}__${row.subGroup.subGroupCode}`

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, {
        id: groupKey,
        name: row.group.groupName,
        code: row.group.groupCode,
        level: 1,
        children: [],
      })
    }
    const groupNode = groupMap.get(groupKey)!

    let subGroupNode = groupNode.children!.find((c) => c.id === subGroupKey)
    if (!subGroupNode) {
      subGroupNode = {
        id: subGroupKey,
        name: row.subGroup.subGroupName,
        code: row.subGroup.subGroupCode,
        level: 2,
        children: [],
      }
      groupNode.children!.push(subGroupNode)
    }

    subGroupNode.children!.push({
      id: String(row.id),
      name: row.rootGroupName,
      code: row.groupCode,
      level: 3,
    })
  }

  return Array.from(groupMap.values())
}