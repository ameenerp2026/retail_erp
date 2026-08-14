import type { AccountGroupRow } from '@/types/accountGroup'

export const MOCK_ACCOUNT_GROUPS: AccountGroupRow[] = [
  { id: 3, rootGroupName: "Cash & Cash Equivalents", groupCode: "AG003",
    group: { groupName: "Assets", groupCode: "AG001" },
    subGroup: { subGroupName: "Current Assets", subGroupCode: "AG002" } },
  { id: 4, rootGroupName: "Bank Accounts", groupCode: "AG006",
    group: { groupName: "Assets", groupCode: "AG001" },
    subGroup: { subGroupName: "Current Assets", subGroupCode: "AG002" } },
  { id: 5, rootGroupName: "Accounts Receivable", groupCode: "AG007",
    group: { groupName: "Assets", groupCode: "AG001" },
    subGroup: { subGroupName: "Current Assets", subGroupCode: "AG002" } },

  { id: 7, rootGroupName: "Land & Building", groupCode: "AG008",
    group: { groupName: "Assets", groupCode: "AG001" },
    subGroup: { subGroupName: "Fixed Assets", subGroupCode: "AG063" } },
  { id: 8, rootGroupName: "Plant & Machinery", groupCode: "AG009",
    group: { groupName: "Assets", groupCode: "AG001" },
    subGroup: { subGroupName: "Fixed Assets", subGroupCode: "AG063" } },

  { id: 11, rootGroupName: "Accounts Payable", groupCode: "AG014",
    group: { groupName: "Liabilities", groupCode: "AG016" },
    subGroup: { subGroupName: "Current Liabilities", subGroupCode: "AG017" } },
  { id: 12, rootGroupName: "GST Payable", groupCode: "AG015",
    group: { groupName: "Liabilities", groupCode: "AG016" },
    subGroup: { subGroupName: "Current Liabilities", subGroupCode: "AG017" } },

  { id: 16, rootGroupName: "Sales - Retail", groupCode: "AG019",
    group: { groupName: "Income", groupCode: "AG016" },
    subGroup: { subGroupName: "Revenue", subGroupCode: "AG017" } },
  { id: 17, rootGroupName: "Service Income", groupCode: "AG020",
    group: { groupName: "Income", groupCode: "AG016" },
    subGroup: { subGroupName: "Revenue", subGroupCode: "AG017" } },
]