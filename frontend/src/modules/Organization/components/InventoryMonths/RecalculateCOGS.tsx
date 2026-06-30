import ReusableTable from '@/components/shared/ReusableTable';
import StatusTag from '@/components/shared/StatusTags';
import { logEntries, Recalculate_COGS_months, summaryItems } from '@/mocks/inventoryMonths.mock';
import type {RecalculateCOGS} from '@/types/inventory';
import { ColumnsType } from 'antd/es/table';
import { AlertTriangle, ArrowLeft, Calendar, Play } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const columns: ColumnsType<RecalculateCOGS> = [
  {
    title: "MONTH",
    dataIndex: "month",
    key: "month",
    render: (text) => <span className="text-blue-600 font-medium">{text}</span>
  },
    { title: "PERIOD", dataIndex: "period", key: "period" },
    {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        render: (status) => <StatusTag status={status} />
      }
]

export default function RecalculateCOGS() {
  const navigate = useNavigate();
  return (
     <div className="min-h-screen bg-[#f7f9fc] p-4 text-slate-900 sm:p-6 lg:p-8" data-node-id="454:6457" data-name="Main Content">
      <div className="mx-auto max-w-7xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,76,154,0.08)] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold leading-[31px] tracking-[-0.02em] text-[#043793]">
              Recalculate COGS
            </h1>
            <p className="mt-1 text-sm text-[#6b7a99]">
              Select months and run cost of goods sold recalculation
            </p>
          </div>
          <button
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 rounded-[18px] border border-[rgba(15,76,154,0.12)] bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="mt-6 rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => (
              <div key={item.label} className="rounded-[12px] bg-slate-50/80 px-4 py-3 text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#6b7a99]">
                  {item.label}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#1a2332]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between border-b border-[rgba(15,76,154,0.12)] px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-[#1a2332]">Month Selection</h2>
              </div>
              <p className="text-xs text-[#6b7a99]">2 selected</p>
            </div>

            <div className="overflow-x-auto">
              <ReusableTable columns={columns} data={Recalculate_COGS_months} rowKey="id"/>
            </div>
          </section>

          <section className="overflow-hidden rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between border-b border-[rgba(15,76,154,0.12)] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eff6ff] text-[#0f4c9a]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                    <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold text-[#1a2332]">Execution Log</h2>
              </div>
            </div>

            <div className="border-b border-[rgba(15,76,154,0.12)] bg-[rgba(238,242,248,0.3)] px-4 py-3">
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b7a99]">
                <div className="flex items-center gap-2">
                  <span className="text-base">👤</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em]">Started By</div>
                    <div className="font-medium text-[#1a2332]">Admin User</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🕒</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em]">Started At</div>
                    <div className="font-medium text-[#1a2332]">12 Jun 2026, 09:14</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">⏱️</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em]">Runtime</div>
                    <div className="font-medium text-[#1a2332]">2m 34s</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-[rgba(15,76,154,0.12)] px-4 py-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1a2332]">Progress</span>
                <span className="font-semibold text-[#0f4c9a]">62%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#eef2f8]">
                <div className="h-full w-[62%] rounded-full bg-[#0f4c9a]" />
              </div>
              <p className="mt-3 text-xs text-[#6b7a99]">
                Current Step: Writing COGS journal entries for APR-26
              </p>
            </div>

            <div className="bg-[#0f172b] px-4 py-4 font-mono text-[11px] leading-6 text-slate-200">
              {logEntries.map((entry) => (
                <div key={entry.time} className="flex flex-wrap gap-2">
                  <span className="text-[#62748e]">{entry.time}</span>
                  <span className="text-[#51a2ff]">{entry.level}</span>
                  <span className="text-slate-200">{entry.message}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
            <div className="mt-6 flex flex-col gap-3 rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
            <AlertTriangle size={16} className="text-[#F54900]" />
            <span>2 months selected for recalculation</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-[18px] border border-[rgba(15,76,154,0.12)] bg-white px-4 py-2 text-sm font-medium text-[#1a2332] shadow-sm">
              Cancel
            </button>
            <button className="inline-flex items-center gap-2 rounded-[18px] border border-[rgba(15,76,154,0.12)] bg-white px-4 py-2 text-sm font-medium text-[#1a2332] shadow-sm">
              <Calendar size={16} />
              Schedule Run
            </button>
            <button className="inline-flex items-center gap-2 rounded-[18px] bg-[#0f4c9a] px-4 py-2 text-sm font-medium text-white shadow-sm">
              <Play size={16} />
              Run COGS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}