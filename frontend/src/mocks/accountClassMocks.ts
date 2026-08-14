import type { AccountClassRecord } from '@/types/accountClass'

// Consistent fake IDs per parentGroup name — only need to satisfy the type
// and stay internally consistent, since this is mock data (VITE_USE_MOCKS)
const GROUP_ID: Record<string, number> = {
  'Current Assets': 1,
  'Current Liabilities': 2,
  'Revenue': 3,
  'Direct Expenses': 4,
  'Indirect Expenses': 5,
  'Fixed Assets': 6,
}

export const MOCK_ACCOUNT_CLASSES: AccountClassRecord[] = [
  { id: "1", code: "AC001", name: "Cash & Bank",            accountGroupId: GROUP_ID['Current Assets'],      parentGroup: "Current Assets",     parentGroupColor: "bg-[#0B4D8C1A] text-[#0B4D8C]",    description: "Liquid cash and bank account ledgers",           linkedLedgers: 24, status: "Active",   lastUpdated: "21 May 2026", iconColor: "text-[#0B4D8C]",iconBgColor: "bg-[#0B4D8C1A]" }, 
  { id: "2", code: "AC002", name: "Trade Receivables",      accountGroupId: GROUP_ID['Current Assets'],      parentGroup: "Current Assets",     parentGroupColor: "bg-[#0B4D8C1A] text-[#0B4D8C]",    description: "Customer accounts receivable ledgers",           linkedLedgers: 18, status: "Active",   lastUpdated: "20 May 2026", iconColor: "text-[#0B4D8C]",iconBgColor: "bg-[#0B4D8C1A]"   },
  { id: "3", code: "AC003", name: "Trade Payables",         accountGroupId: GROUP_ID['Current Liabilities'], parentGroup: "Current Liabilities",parentGroupColor: "bg-[#EF44441A] text-[#EF4444]",      description: "Vendor and supplier payment ledgers",            linkedLedgers: 18, status: "Active",   lastUpdated: "19 May 2026", iconColor: "text-[#EF4444]",iconBgColor: "bg-[#EF44441A]"    },
  { id: "4", code: "AC004", name: "Direct Sales",           accountGroupId: GROUP_ID['Revenue'],             parentGroup: "Revenue",            parentGroupColor: "bg-[#22C55E1A] text-[#22C55E]",  description: "Primary retail revenue accounts",                linkedLedgers: 11, status: "Active",   lastUpdated: "18 May 2026", iconColor: "text-[#22C55E]",iconBgColor: "bg-[#22C55E1A]"  },
  { id: "5", code: "AC005", name: "Cost of Goods",          accountGroupId: GROUP_ID['Direct Expenses'],     parentGroup: "Direct Expenses",    parentGroupColor: "bg-[#F59E0B1A] text-[#F59E0B]",description: "COGS and purchase-related accounts",             linkedLedgers: 9,  status: "Active",   lastUpdated: "17 May 2026", iconColor: "text-[#F59E0B]",iconBgColor: "bg-[#F59E0B1A]" },
  { id: "6", code: "AC006", name: "Overhead Expenses",      accountGroupId: GROUP_ID['Indirect Expenses'],   parentGroup: "Indirect Expenses",  parentGroupColor: "bg-[#8B5CF61A] text-[#8B5CF6]",description: "Administrative and operational costs",           linkedLedgers:16, status: "Active",   lastUpdated:("16 May 2026"), iconColor:"text-[#8B5CF6]",iconBgColor:"bg-[#8B5CF61A]" },
  { id: "7", code: "AC007", name: "Fixed Asset Register",   accountGroupId: GROUP_ID['Fixed Assets'],        parentGroup: "Fixed Assets",       parentGroupColor: "bg-[#4FC3F71A] text-[#4FC3F7]",    description: "Property, plant and equipment ledgers",          linkedLedgers: 7,  status: "Active",   lastUpdated: "15 May 2026", iconColor: "text-[#4FC3F7]",iconBgColor: "bg-[#4FC3F71A]"  },
  { id: "8", code: "AC008", name: "Tax Accounts",           accountGroupId: GROUP_ID['Current Liabilities'], parentGroup: "Current Liabilities",parentGroupColor: "bg-[#EF44441A] text-[#EF4444]",      description: "GST, TDS, income tax ledgers",                   linkedLedgers: 12, status: "Active",   lastUpdated: "14 May 2026", iconColor: "text-[#EF4444]",iconBgColor: "bg-[#EF44441A]"    },
  { id: "9", code: "AC009", name: "Employee Advances",      accountGroupId: GROUP_ID['Current Assets'],      parentGroup: "Current Assets",     parentGroupColor: "bg-[#0B4D8C1A] text-[#0B4D8C]",    description: "Staff loans and advance records",                linkedLedgers: 5,  status: "Inactive", lastUpdated: "10 May 2026", iconColor: "text-[#0B4D8C]",iconBgColor: "bg-[#0B4D8C1A]"  },
]