import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { dashboardService } from '@/services/dashboardService'

function ModuleUsage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dashboard-module-usage'],
    queryFn: dashboardService.getModuleUsage,
  })

  return (
    <div className="section-card h-full min-h-[280px] sm:min-h-[360px]">
      <div>
        <h2 className="section-title">Module Usage</h2>
        <p className="mt-0.5 text-xs text-slate-400">Activity distribution</p>
      </div>

      {isLoading ? (
        <div className="mt-8 text-center text-sm text-slate-400">Loading...</div>
      ) : (
        <>
          <div className="mt-4 h-[160px] sm:h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={4}
                >
                  {data.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2.5 sm:space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#0F3F91]">{item.value}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ModuleUsage
