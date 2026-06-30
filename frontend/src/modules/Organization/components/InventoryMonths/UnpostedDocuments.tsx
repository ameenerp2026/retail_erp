import ReusableTable from "@/components/shared/ReusableTable";
import RunStatCard from "@/components/shared/RunStatCard";
import StatusTag from "@/components/shared/StatusTags";
import { documents } from "@/mocks/inventoryMonths.mock";
import { UnpostedDocument } from "@/types/inventory";
import { ColumnsType } from "antd/es/table/interface";
import { AlertTriangle, ShoppingCart, LucideCuboid, MapPin, Download, Eye, Send } from 'lucide-react'

const summaryCards = [
  { label: 'Total Documents', count: '6',icon: <AlertTriangle size={18} className="text-[#E17100]" />,iconBgColor: "bg-[#FFFBEB]"},
  { label: 'Affected Sites', count: '4',icon: <MapPin size={18} className="text-[#155DFC]" />,iconBgColor: "bg-[#EFF6FF]"},
  { label: 'Retail Sale Entries', count: '4',icon: <ShoppingCart size={18} className="text-[#009966]" />,iconBgColor: "bg-[#ECFDF5]"},
  { label: 'Purchase Entries', count: '2',icon: <LucideCuboid size={18} className="text-[#7F22FE]" />,iconBgColor: "bg-[#F5F3FF]"},
];
const columns: ColumnsType<UnpostedDocument> = [
  {
    title: "SITE",
    dataIndex: "site",
    key: "site",
     render: (site: string) => (
      <div className="flex items-center gap-1.5">
        <MapPin size={14} className="text-[#6B7280]" />
        <span>{site}</span>
      </div>
    )
  },
  { title: "ENTRY TYPE", dataIndex: "entryType", key: "entryType" },
  { title: "DOCUMENT NUMBER",   dataIndex: "documentNumber",   key: "documentNumber"   },
  { title: "DOCUMENT DATE",    dataIndex: "documentDate",   key: "documentDate"   },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (status) => <StatusTag status={status} />
  },
  {
    title: "ACTIONS",
    key: "action",
    render: () => (
        <div className="inline-flex items-center gap-2">
            <button className="rounded-[14px] border border-[rgba(15,76,154,0.12)] bg-white px-3 py-1.5 text-[10px] font-medium text-[#6b7a99] flex items-center gap-1.5">
                          <Eye size={14} />
                          View
                        </button>
                        <button className="rounded-[14px] bg-[rgba(15,76,154,0.1)] px-3 py-1.5 text-[10px] font-medium text-[#0f4c9a] flex items-center gap-1.5">
                          <Send  size={14} />
                          Post
                        </button>
        </div>
    )},
]

export default function UnpostedDocuments() {
    return(
        <div>
            <div className="rounded-[16px] border border-[#fee685] bg-[#fffbeb] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    {/* <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-[#fef3c6] text-[#bb4d00]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <path d="M12 9v5m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </div> */}
                    <div>
                    <h1 className="text-[14px] font-semibold tracking-[0.24em] text-[#973c00]">
                        Month Cannot Be Closed
                    </h1>
                    <p className="mt-2 text-[12px] leading-6 text-[#bb4d00]">
                        <span>APR-26 contains </span>
                        <span className="font-semibold">6 unposted documents</span>
                        <span> across </span>
                        <span className="font-semibold">4 sites</span>
                        <span>. All documents must be posted or voided before the month can be closed. Please review and action each document below.</span>
                    </p>
                    </div>
                </div>
            </div>
            {/* Summary Cards */}
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((stat) => (
                        <RunStatCard
                          key={stat.label} // or idx
                          label={stat.label}
                          count={stat.count}
                          icon={stat.icon}
                          iconBgColor={stat.iconBgColor}
                        />
                      ))}
            </div>
            {/* Table */}
              <div className="mt-6 overflow-hidden rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between border-b border-[rgba(15,76,154,0.12)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1a2332]">Documents Requiring Action</h2>
            <button className="inline-flex items-center gap-2 rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#6b7a99]">
             <Download size={14} />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <ReusableTable
                   columns={columns}
                   data={documents}
                   rowKey="id"
            />
          </div>
        </div>
        </div>
       
        
        
    )

}