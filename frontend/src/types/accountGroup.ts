export type AccountGroupNode = {
  id: string
  code: string
  name: string
  level: 1 | 2 | 3
  children?: AccountGroupNode[]
}
export interface Group {
  id: number;
  groupName: string;
  groupCode: string;
  status: string;
}

export interface SubGroup {
  id: number;
  subGroupName: string;
  subGroupCode: string;
  groupId: number;
  status: string;
}
export interface CreateAccountGroupRequest {
  rootGroupName: string;
  groupId: number;
  subGroupId: number;
}
export interface UpdateAccountGroupRequest {
  groupId: number;
  subGroupId: number;
  rootGroupName: string;
}
export interface AccountGroupRow {
  id: number
  rootGroupName: string
  groupCode: string
  group: { groupName: string; groupCode: string }
  subGroup: { subGroupName: string; subGroupCode: string }
}