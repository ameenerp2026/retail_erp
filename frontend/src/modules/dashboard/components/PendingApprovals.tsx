import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'

function PendingApprovals() {
  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ['dashboard-pending-approvals'],
    queryFn: dashboardService.getPendingApprovals,
  })

  return (
    <div className="section-card h-full">
      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
        <h2 className="section-title">Pending Approvals</h2>
        <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
          {approvals.length} pending
        </span>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {approvals.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-sky-500">{item.id}</p>
                <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${item.priorityClass}`}>
                  {item.priority}
                </span>
              </div>
              <h3 className="mt-1.5 text-sm font-semibold text-slate-700">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-400">by {item.requestedBy}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <button type="button" className="h-9 rounded-xl bg-green-50 text-xs font-semibold text-green-600">
                  Approve
                </button>
                <button type="button" className="h-9 rounded-xl bg-red-50 text-xs font-semibold text-red-500">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingApprovals
