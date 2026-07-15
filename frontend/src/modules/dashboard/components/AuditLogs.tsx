import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import { dashboardService } from '@/services/dashboardService'

function AuditLog() {
  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['dashboard-audit-logs'],
    queryFn: dashboardService.getAuditLogs,
  })

  return (
    <div className="section-card h-full">
      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
        <div>
          <h2 className="section-title">Recent Audit Log</h2>
          <p className="mt-0.5 text-xs text-slate-400">Last {auditLogs.length || 6} system events</p>
        </div>
        <button type="button" className="shrink-0 text-xs font-semibold text-[#14B8A6]">
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {auditLogs.map((log, index) => (
            <div
              key={`${log.user}-${index}`}
              className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4"
            >
              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0 ${log.color}`} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-700">{log.user}</p>
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs text-sky-500">{log.module}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{log.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 self-end text-[11px] text-slate-400 sm:self-auto">
                <Clock size={11} />
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditLog
