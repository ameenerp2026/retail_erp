import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'

function StorageUsage() {
  const { data: storageItems = [], isLoading } = useQuery({
    queryKey: ['dashboard-storage'],
    queryFn: dashboardService.getStorageUsage,
  })

  return (
    <div className="section-card h-full">
      <h2 className="section-title mb-5">Storage Usage</h2>
      {isLoading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {storageItems.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-slate-600 sm:text-sm">{item.label}</p>
                <p className="text-xs font-semibold text-[#0F3F91] sm:text-sm">{item.value}%</p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 sm:h-3">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StorageUsage
