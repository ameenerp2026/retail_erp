import Card from '../../components/common/Card'
import ReusableTable from '../../components/common/ReusableTable'
import { Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";


type AccountClass = {
  id: number;
  className: string;
  code: string;
  parentGroup: string;
  description: string;
  linkedLedgers: string;
  status: string;
  lastUpdated: string;
};


const data: AccountClass[] = [
  {
    id: 1,
    className: "Cash & Bank",
    code: "AC001",
    parentGroup: "Current Assets",
    description: "Liquid cash and bank account ledgers",
    linkedLedgers: "24 ledgers",
    status: "Active",
    lastUpdated: "21 May 2026",
  },
  {
    id: 2,
    className: "Trade Receivables",
    code: "AC002",
    parentGroup: "Current Assets",
    description: "Customer accounts receivable ledgers",
    linkedLedgers: "18 ledgers",
    status: "Active",
    lastUpdated: "20 May 2026",
  },
  {
    id: 3,
    className: "Trade Payables",
    code: "AC003",
    parentGroup: "Current Liabilities",
    description: "Vendor and supplier payment ledgers",
    linkedLedgers: "18 ledgers",
    status: "Active",
    lastUpdated: "19 May 2026",
  },
  {
    id: 4,
    className: "Direct Sales",
    code: "AC004",
    parentGroup: "Revenue",
    description: "Primary retail revenue accounts",
    linkedLedgers: "11 ledgers",
    status: "Active",
    lastUpdated: "18 May 2026",
  },
  {
    id: 5,
    className: "Cost of Goods",
    code: "AC005",
    parentGroup: "Direct Expenses",
    description: "COGS and purchase-related accounts",
    linkedLedgers: "9 ledgers",
    status: "Active",
    lastUpdated: "17 May 2026",
  },
  {
    id: 6,
    className: "Overhead Expenses",
    code: "AC006",
    parentGroup: "Indirect Expenses",
    description: "Administrative and operational costs",
    linkedLedgers: "16 ledgers",
    status: "Active",
    lastUpdated: "16 May 2026",
  },
  {
    id: 7,
    className: "Fixed Asset Register",
    code: "AC007",
    parentGroup: "Fixed Assets",
    description: "Property, plant and equipment ledgers",
    linkedLedgers: "7 ledgers",
    status: "Active",
    lastUpdated: "15 May 2026",
  },
  {
    id: 8,
    className: "Tax Accounts",
    code: "AC008",
    parentGroup: "Current Liabilities",
    description: "GST, TDS and tax liability accounts",
    linkedLedgers: "12 ledgers",
    status: "Active",
    lastUpdated: "14 May 2026",
  },
  {
    id: 9,
    className: "Employee Advances",
    code: "AC009",
    parentGroup: "Current Assets",
    description: "Staff loans and advance records",
    linkedLedgers: "5 ledgers",
    status: "Inactive",
    lastUpdated: "10 May 2026",
  },
  {
    id: 10,
    className: "Inventory Stock",
    code: "AC010",
    parentGroup: "Current Assets",
    description: "Inventory valuation and stock accounts",
    linkedLedgers: "14 ledgers",
    status: "Active",
    lastUpdated: "09 May 2026",
  },
  {
    id: 11,
    className: "Bank Loans",
    code: "AC011",
    parentGroup: "Long Term Liabilities",
    description: "Loan and borrowing accounts",
    linkedLedgers: "8 ledgers",
    status: "Active",
    lastUpdated: "08 May 2026",
  },
  {
    id: 12,
    className: "Capital Account",
    code: "AC012",
    parentGroup: "Equity",
    description: "Owner capital contribution accounts",
    linkedLedgers: "3 ledgers",
    status: "Active",
    lastUpdated: "07 May 2026",
  },
  {
    id: 13,
    className: "Retained Earnings",
    code: "AC013",
    parentGroup: "Equity",
    description: "Accumulated profit and loss accounts",
    linkedLedgers: "2 ledgers",
    status: "Active",
    lastUpdated: "06 May 2026",
  },
  {
    id: 14,
    className: "Marketing Expenses",
    code: "AC014",
    parentGroup: "Indirect Expenses",
    description: "Advertising and promotion expenses",
    linkedLedgers: "10 ledgers",
    status: "Active",
    lastUpdated: "05 May 2026",
  },
  {
    id: 15,
    className: "Rental Income",
    code: "AC015",
    parentGroup: "Other Income",
    description: "Income generated from rentals",
    linkedLedgers: "4 ledgers",
    status: "Active",
    lastUpdated: "04 May 2026",
  },
  {
    id: 16,
    className: "Miscellaneous Expenses",
    code: "AC016",
    parentGroup: "Indirect Expenses",
    description: "General miscellaneous expenses",
    linkedLedgers: "6 ledgers",
    status: "Inactive",
    lastUpdated: "03 May 2026",
  },
];
const columns: ColumnsType<AccountClass> = [
  {
    title: "CLASS NAME",
    dataIndex: "className",
    render: (_, record) => (
      <div>
        <div className="font-semibold text-[#043793]">{record.className}</div>
        <div className="text-xs text-slate-400">{record.code}</div>
      </div>
    ),
  },
  {
    title: "PARENT GROUP",
    dataIndex: "parentGroup",
    render: (value) => <Tag color="blue">{value}</Tag>,
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
  },
  {
    title: "LINKED LEDGERS",
    dataIndex: "linkedLedgers",
    render: (value) => (
      <span className="font-semibold text-[#043793]">{value}</span>
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    render: (status) => (
      <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
    ),
  },
  {
    title: "LAST UPDATED",
    dataIndex: "lastUpdated",
  },
  {
    title: "ACTIONS",
    render: () => (
      <Space>
        <EditOutlined className="text-sky-500 cursor-pointer" />
        <DeleteOutlined className="text-slate-300 cursor-pointer" />
      </Space>
    ),
  },
];
function AccountClass() {
  return (
    <>
    
    <span className='text-[13px] text-[#6B7280] font-normal'>Organize ledgers into structured finance categories</span>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 cardSection">
     
        <div className='xl:col-span-3'>
       <Card 
       count={9}
       description='Total Classes'
       countColor='#0B4D8C'
       />
       </div>
       <div className='xl:col-span-3'>
       <Card 
       count={8}
       description='Active Classes'
       countColor='#22C55E'
       />
       
        </div>
        <div className='xl:col-span-3'>
        <Card 
       count={120}
       description='Linked Ledgers'
       countColor='#21B6A8'
       />
       
        </div>
        <div className='xl:col-span-3'>
       <Card 
       count={9}
       description='Recently Updated'
       countColor='#F59E0B'
       />
         </div>
         </div>

        
    
     <div className="grid grid-cols-1 tableSection">
        <ReusableTable<AccountClass> columns={columns} data={data}/>
     </div>
    
    </>
  )
}

export default AccountClass