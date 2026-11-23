import { useState, useMemo } from 'react'
import {
  Package,
  Tag,
  ScanBarcode,
  AlertTriangle,
  CheckCircle2,
  Box,
  SlidersHorizontal,
  Scale,
  FolderTree,
  GitFork,
  Calendar,
  ChevronDown,
  RotateCcw,
  Download,
  Settings,
  Search,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { PRODUCT_ACTIVITIES_MOCK } from '@/mocks/productActivity.mock'
import type { ProductActivityItem } from '@/types/productActivity'
import { exportToPDF, exportToCSV } from '@/utils/exportData'

export default function ActivityTab() {
  const [productSearch, setProductSearch] = useState('')
  const [selectedActivityType, setSelectedActivityType] = useState<string>('All Activities')
  const [selectedUser, setSelectedUser] = useState<string>('All Users')
  const [dateRange, setDateRange] = useState<string>('Jan 01, 2025 – Jan 31, 2025')
  
  // Dropdown open states
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)

  // Options
  const activityTypes = [
    'All Activities',
    'Stock Received',
    'Price Updated',
    'Barcode Generated',
    'Low Stock Alert',
    'Approval Granted',
    'Product Created',
    'Attribute Updated',
    'UOM Mapped',
    'Category Changed',
    'Hierarchy Updated',
  ]

  const usersList = [
    'All Users',
    'Arun Nair',
    'Arjun Sharma',
    'Vikram Kumar',
    'Ravi Subramanian',
    'System',
  ]

  const datePresets = [
    'Jan 01, 2025 – Jan 31, 2025',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
    'Last Month',
    'All Time',
  ]

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return PRODUCT_ACTIVITIES_MOCK.filter((item) => {
      // Product code or name search
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase().trim()
        const matchCode = item.productCode.toLowerCase().includes(query)
        const matchName = item.productName.toLowerCase().includes(query)
        if (!matchCode && !matchName) return false
      }

      // Activity Type
      if (selectedActivityType !== 'All Activities') {
        if (item.activity !== selectedActivityType) return false
      }

      // Performed By
      if (selectedUser !== 'All Users') {
        if (item.performedBy !== selectedUser) return false
      }

      return true
    })
  }, [productSearch, selectedActivityType, selectedUser])

  // Reset Filters
  const handleReset = () => {
    setProductSearch('')
    setSelectedActivityType('All Activities')
    setSelectedUser('All Users')
    setDateRange('Jan 01, 2025 – Jan 31, 2025')
    setIsActivityDropdownOpen(false)
    setIsUserDropdownOpen(false)
    setIsDateDropdownOpen(false)
    toast.success('Filters reset to default')
  }

  // Export
  const handleExport = () => {
    if (filteredActivities.length === 0) {
      toast.error('No activities to export')
      return
    }

    try {
      exportToPDF<ProductActivityItem>(
        filteredActivities,
        [
          { header: 'Activity', accessor: (row) => row.activity },
          { header: 'Product Code', accessor: (row) => row.productCode },
          { header: 'Product Name', accessor: (row) => row.productName },
          { header: 'Details', accessor: (row) => row.details },
          { header: 'Performed By', accessor: (row) => `${row.performedBy} ${row.role || ''}`.trim() },
          { header: 'Date & Time', accessor: (row) => row.timestamp },
        ],
        {
          filename: `product_activities_${new Date().toISOString().slice(0, 10)}.pdf`,
          title: 'Product Setup - Activity Log',
          orientation: 'landscape',
        }
      )
      toast.success('Activity log exported successfully')
    } catch {
      // Fallback to CSV if PDF fails
      exportToCSV<ProductActivityItem>(
        filteredActivities,
        [
          { header: 'Activity', accessor: (row) => row.activity },
          { header: 'Product Code', accessor: (row) => row.productCode },
          { header: 'Product Name', accessor: (row) => row.productName },
          { header: 'Details', accessor: (row) => row.details },
          { header: 'Performed By', accessor: (row) => `${row.performedBy} ${row.role || ''}`.trim() },
          { header: 'Date & Time', accessor: (row) => row.timestamp },
        ],
        `product_activities_${new Date().toISOString().slice(0, 10)}.csv`
      )
      toast.success('Activity log exported as CSV')
    }
  }

  // Render Icon according to item
  const renderActivityIcon = (item: ProductActivityItem) => {
    const iconSize = 18
    switch (item.iconType) {
      case 'package':
        return <Package size={iconSize} />
      case 'tag':
        return <Tag size={iconSize} />
      case 'barcode':
        return <ScanBarcode size={iconSize} />
      case 'alert':
        return <AlertTriangle size={iconSize} />
      case 'check':
        return <CheckCircle2 size={iconSize} />
      case 'box':
        return <Box size={iconSize} />
      case 'attribute':
        return <SlidersHorizontal size={iconSize} />
      case 'uom':
        return <Scale size={iconSize} />
      case 'category':
        return <FolderTree size={iconSize} />
      case 'hierarchy':
        return <GitFork size={iconSize} />
      default:
        return <Package size={iconSize} />
    }
  }

  return (
    <div className="space-y-4 px-4 sm:px-6 pb-12">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Activity</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor all activities performed on products, including creation, updates, pricing, and approvals.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateDropdownOpen(!isDateDropdownOpen)
                setIsActivityDropdownOpen(false)
                setIsUserDropdownOpen(false)
              }}
              className="flex flex-col text-left border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:border-slate-300 min-w-[210px] transition-colors"
            >
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Date Range</span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mt-0.5">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{dateRange}</span>
                <ChevronDown size={13} className="text-slate-400 ml-auto shrink-0" />
              </div>
            </button>

            {isDateDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                {datePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setDateRange(preset)
                      setIsDateDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      dateRange === preset ? 'text-[#155DFC] font-semibold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{preset}</span>
                    {dateRange === preset && <Check size={14} className="text-[#155DFC]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Code Search */}
          <div className="flex flex-col border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:border-slate-300 min-w-[190px] transition-colors focus-within:border-[#155DFC] focus-within:ring-1 focus-within:ring-[#155DFC]/20">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Product Code</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-0.5">
              <Search size={13} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search product code..."
                className="w-full bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 outline-none"
              />
              {productSearch && (
                <button
                  type="button"
                  onClick={() => setProductSearch('')}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Activity Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsActivityDropdownOpen(!isActivityDropdownOpen)
                setIsDateDropdownOpen(false)
                setIsUserDropdownOpen(false)
              }}
              className="flex flex-col text-left border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:border-slate-300 min-w-[170px] transition-colors"
            >
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Activity Type</span>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mt-0.5">
                <span className="truncate">{selectedActivityType}</span>
                <ChevronDown size={13} className="text-slate-400 ml-1.5 shrink-0" />
              </div>
            </button>

            {isActivityDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
                {activityTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedActivityType(type)
                      setIsActivityDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedActivityType === type ? 'text-[#155DFC] font-semibold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{type}</span>
                    {selectedActivityType === type && <Check size={14} className="text-[#155DFC]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Performed By Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen)
                setIsDateDropdownOpen(false)
                setIsActivityDropdownOpen(false)
              }}
              className="flex flex-col text-left border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:border-slate-300 min-w-[160px] transition-colors"
            >
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Performed By</span>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mt-0.5">
                <span className="truncate">{selectedUser}</span>
                <ChevronDown size={13} className="text-slate-400 ml-1.5 shrink-0" />
              </div>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                {usersList.map((user) => (
                  <button
                    key={user}
                    type="button"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsUserDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedUser === user ? 'text-[#155DFC] font-semibold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{user}</span>
                    {selectedUser === user && <Check size={14} className="text-[#155DFC]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              title="Reset all filters"
            >
              <RotateCcw size={13} className="text-slate-500" />
              <span>Reset</span>
            </button>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#155DFC] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
              title="Export activities"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activities Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-3.5 pl-6 pr-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[280px]">
                  Activity
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[130px]">
                  Product Code
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[170px]">
                  Product Name
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[180px]">
                  Performed By
                </th>
                <th className="py-3.5 pl-4 pr-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[150px] text-right sm:text-left">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No activities found matching your filters.
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-[#155DFC] hover:underline font-medium text-xs"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((item, index) => {
                  const isFirst = index === 0
                  const isLast = index === filteredActivities.length - 1

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Activity Column with Vertical Timeline */}
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="relative flex items-center gap-3">
                          {/* Continuous Vertical Timeline Line */}
                          <div
                            className={`absolute left-[5px] w-[2px] bg-slate-200 ${
                              isFirst && isLast
                                ? 'hidden'
                                : isFirst
                                ? 'top-1/2 bottom-0'
                                : isLast
                                ? 'top-0 bottom-1/2'
                                : 'top-0 bottom-0'
                            }`}
                            style={{
                              // Extend timeline vertically to connect smoothly between rows
                              top: isFirst ? '50%' : '-16px',
                              bottom: isLast ? '50%' : '-16px',
                            }}
                          />

                          {/* Status Dot */}
                          <div
                            className={`relative z-10 w-2.5 h-2.5 rounded-full ring-4 ring-white shrink-0 ${
                              item.dotColor || 'bg-blue-500'
                            }`}
                          />

                          {/* Icon Badge */}
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                              item.iconBg || 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}
                          >
                            {renderActivityIcon(item)}
                          </div>

                          {/* Activity Title & Subtitle */}
                          <div className="min-w-0">
                            <div className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-tight">
                              {item.activity}
                            </div>
                            {item.subtext && (
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5 leading-tight">
                                {item.subtext}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product Code */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200/60 inline-block">
                          {item.productCode}
                        </span>
                      </td>

                      {/* Product Name */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs sm:text-[13px] font-medium text-slate-900 block truncate max-w-[170px]" title={item.productName}>
                          {item.productName}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs sm:text-[13px] text-slate-600 block">
                          {item.details}
                        </span>
                      </td>

                      {/* Performed By */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {item.performedBy === 'System' ? (
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                              <Settings size={12} />
                            </div>
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                                item.avatarBg || 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {item.avatar}
                            </div>
                          )}
                          <div className="text-xs sm:text-[13px] font-medium text-slate-800 flex items-center truncate">
                            <span>{item.performedBy}</span>
                            {item.role && (
                              <span className="text-slate-400 font-normal text-xs ml-1">
                                {item.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 pl-4 pr-6 text-right sm:text-left">
                        <span className="text-xs sm:text-[13px] text-slate-500 whitespace-nowrap">
                          {item.timestamp}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="font-semibold text-slate-700">{filteredActivities.length}</strong> of{' '}
            <strong className="font-semibold text-slate-700">{PRODUCT_ACTIVITIES_MOCK.length}</strong> activities
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time activity audit log
          </span>
        </div>
      </div>
    </div>
  )
}
