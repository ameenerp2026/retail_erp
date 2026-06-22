import { useState } from 'react'
import { Modal } from '@/components/shared/Modal'
import YearListItem from '../components/AccountingYear/YearListItem'
import PeriodGrid from '../components/AccountingYear/PeriodGrid'
import AccountingYearForm from '../components/AccountingYear/AccountingYearForm'
import { AccountingYear, Period, PeriodStatus } from '@/types/accounting'

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

export default function AccountingYearPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedYearId, setSelectedYearId] = useState(2)

  const years: AccountingYear[] = [
    { id: 1, label: 'FY 2025-26', dateRange: '01 Apr 2025 — 31 Mar 2026', status: 'Active', closedPeriods: 2, totalPeriods: 12 },
    { id: 2, label: 'FY 2024-25', dateRange: '01 Apr 2024 — 31 Mar 2025', status: 'Closed', closedPeriods: 12, totalPeriods: 12 },
    { id: 3, label: 'FY 2026-27', dateRange: '01 Apr 2026 — 31 Mar 2027', status: 'Pending', closedPeriods: 0, totalPeriods: 12 },
  ]

  const selectedYear = years.find(y => y.id === selectedYearId)!

  const getPeriodsForYear = (year: AccountingYear): Period[] => {
    const startYear = parseInt(year.dateRange.split(' ')[2])
    return months.map((month, idx) => {
      const isNextCalendarYear = idx >= 9
      const displayYear = isNextCalendarYear? `${startYear}-${String(startYear + 1).slice(2)}` : `${startYear}`
      
      let status: PeriodStatus = 'Pending'
      if (year.status === 'Closed') status = 'Closed'
      else if (year.status === 'Active' && idx < year.closedPeriods) status = 'Closed'
      else if (year.status === 'Active' && idx === year.closedPeriods) status = 'Open'

      return { month, year: displayYear, status }
    })
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[24px] text-[#043793] font-bold">Accounting Year</h1>
          <p className="text-[13px] text-[#94A3B8]">Fiscal year setup and period configuration</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 text-white px-4 py-2.5 rounded-xl bg-[linear-gradient(#093055,#043793)] text-sm font-medium flex items-center gap-2"
        >
          <span>+</span> New Accounting Year
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-3">
          {years.map((year) => (
            <YearListItem
              key={year.id}
              year={year}
              isSelected={year.id === selectedYearId}
              onSelect={() => setSelectedYearId(year.id)}
            />
          ))}
        </div>

        <PeriodGrid
          year={selectedYear}
          periods={getPeriodsForYear(selectedYear)}
          onGenerate={() => console.log('Generate periods')}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AccountingYearForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}