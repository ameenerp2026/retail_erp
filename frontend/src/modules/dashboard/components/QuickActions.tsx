import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'

function QuickActions() {
  const { data: actions = [], isLoading } = useQuery({
    queryKey: ['dashboard-quick-actions'],
    queryFn: dashboardService.getQuickActions,
  })

  return (
    <div className="section-card h-full">
      <h2 className="section-title mb-4">Quick Actions</h2>
      {isLoading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-2 py-3 shadow-sm transition hover:bg-slate-100 sm:min-h-[100px] sm:gap-2.5 sm:py-4"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg sm:h-11 sm:w-11 sm:text-xl ${action.bg}`}
              >
                {action.icon}
              </div>
              <p className="text-center text-[11px] font-medium leading-snug text-slate-600">{action.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuickActions
