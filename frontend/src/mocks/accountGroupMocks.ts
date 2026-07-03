import type { AccountGroupNode } from '@/types/accountGroup'

export const MOCK_ACCOUNT_GROUPS: AccountGroupNode[] = [
  {
    id: "1", code: "AG001", name: "Assets", level: 1,
    children: [
      {
        id: "2", code: "AG002", name: "Current Assets", level: 2,
        children: [
          { id: "3",  code: "AG003", name: "Cash & Cash Equivalents", level: 3 },
          { id: "4",  code: "AG006", name: "Bank Accounts",           level: 3 },
          { id: "5",  code: "AG007", name: "Accounts Receivable",     level: 3 },
        ]
      },
      {
        id: "6", code: "AG063", name: "Fixed Assets", level: 2,
        children: [
          { id: "7",  code: "AG006", name: "Land & Building",   level: 3 },
          { id: "8",  code: "AG009", name: "Plant & Machinery", level: 3 },
        ]
      },
    ]
  },
  {
    id: "9", code: "AG016", name: "Liabilities", level: 1,
    children: [
      {
        id: "10", code: "AG017", name: "Current Liabilities", level: 2,
        children: [
          { id: "11", code: "AG014", name: "Accounts Payable", level: 3 },
          { id: "12", code: "AG015", name: "GST Payable",      level: 3 },
        ]
      },
      { id: "13", code: "AG013", name: "Long-term Liabilities", level: 2 },
    ]
  },
  {
    id: "14", code: "AG016", name: "Income", level: 1,
    children: [
      {
        id: "15", code: "AG017", name: "Revenue", level: 2,
        children: [
          { id: "16", code: "AG019", name: "Sales - Retail",   level: 3 },
          { id: "17", code: "AG020", name: "Service Income",   level: 3 },
        ]
      },
    ]
  },
  {
    id: "18", code: "AG021", name: "Expenses", level: 1,
    children: [
      { id: "19", code: "AG023", name: "Direct Expenses", level: 2 },
      { id: "20", code: "AG024", name: "Indirect Expenses", level: 2 },
    ]
  },
]