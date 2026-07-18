import { useQuery } from '@tanstack/react-query'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { dashboardService } from '@/services/dashboardService'

function PlatformActivities() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dashboard-platform-activity'],
    queryFn: dashboardService.getPlatformActivity,
  })

  return (
    <div className="section-card h-full min-h-[280px] sm:min-h-[360px]">
      <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <h2 className="section-title">Platform Activity</h2>
          <p className="mt-0.5 text-xs text-slate-400">Logins, transactions & errors</p>
        </div>
        <div className="hidden h-9 w-28 shrink-0 rounded-xl border border-slate-200 bg-slate-100 sm:block sm:w-[140px]" />
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="h-[200px] w-full sm:h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="value" stroke="#14B8A6" strokeWidth={2.5} fill="url(#chartGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default PlatformActivities
