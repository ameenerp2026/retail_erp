import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export type DateRange = { start: Date | null; end: Date | null }

type Preset = 'Today' | 'This week' | 'This month' | 'This year' | 'Set up'

const PRESETS: Preset[] = ['Today', 'This week', 'This month', 'This year', 'Set up']
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function isBetween(d: Date, start: Date, end: Date) {
  const t = startOfDay(d).getTime()
  return t > startOfDay(start).getTime() && t < startOfDay(end).getTime()
}
function formatMMDDYYYY(d: Date | null) {
  if (!d) return '--.--.----'
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}.${dd}.${d.getFullYear()}`
}
function getMonthMatrix(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function CalendarMonth({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  start,
  end,
  hoverDate,
  onSelect,
  onHover,
}: {
  year: number
  month: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onPrevYear: () => void
  onNextYear: () => void
  start: Date | null
  end: Date | null
  hoverDate: Date | null
  onSelect: (d: Date) => void
  onHover: (d: Date | null) => void
}) {
  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month])
  const previewEnd = end ?? hoverDate

  return (
    <div className="w-[260px] shrink-0 px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onPrevYear} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <ChevronsLeft size={14} />
          </button>
          <button type="button" onClick={onPrevMonth} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <ChevronLeft size={14} />
          </button>
        </div>
        <span className="text-sm font-semibold text-[#1B2A4A]">
          {year} {MONTH_LABELS[month].slice(0, 3)}
        </span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onNextMonth} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <ChevronRight size={14} />
          </button>
          <button type="button" onClick={onNextYear} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={`${w}-${i}`} className="text-[11px] font-medium text-rose-300">
            {w}
          </div>
        ))}

        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (!day) return <div key={`${wi}-${di}`} className="h-8 w-8" />

            const isStart = isSameDay(day, start)
            const isEnd = isSameDay(day, end)
            const inRange = start && previewEnd && isBetween(day, start, previewEnd)

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                onMouseEnter={() => onHover(day)}
                onClick={() => onSelect(day)}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition ${
                  isStart || isEnd
                    ? 'bg-[#1B2A4A] font-semibold text-white'
                    : inRange
                    ? 'bg-rose-50 text-rose-500'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {day.getDate()}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function DateRangeDropdown({
  value,
  onApply,
  onCancel,
}: {
  value: DateRange
  onApply: (range: DateRange) => void
  onCancel: () => void
}) {
  const today = new Date()
  const [start, setStart] = useState<Date | null>(value.start)
  const [end, setEnd] = useState<Date | null>(value.end)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [preset, setPreset] = useState<Preset>('Set up')

  const initialMonth = value.start ?? today
  const [leftYear, setLeftYear] = useState(initialMonth.getFullYear())
  const [leftMonth, setLeftMonth] = useState(initialMonth.getMonth())

  const rightInit = new Date(leftYear, leftMonth + 1, 1)
  const [rightYear, setRightYear] = useState(rightInit.getFullYear())
  const [rightMonth, setRightMonth] = useState(rightInit.getMonth())

  function shiftLeft(delta: number, unit: 'month' | 'year') {
    const d = new Date(leftYear, leftMonth + (unit === 'month' ? delta : 0), 1)
    if (unit === 'year') d.setFullYear(d.getFullYear() + delta)
    setLeftYear(d.getFullYear())
    setLeftMonth(d.getMonth())
  }
  function shiftRight(delta: number, unit: 'month' | 'year') {
    const d = new Date(rightYear, rightMonth + (unit === 'month' ? delta : 0), 1)
    if (unit === 'year') d.setFullYear(d.getFullYear() + delta)
    setRightYear(d.getFullYear())
    setRightMonth(d.getMonth())
  }

  function handleSelect(day: Date) {
    setPreset('Set up')
    if (!start || (start && end)) {
      setStart(day)
      setEnd(null)
    } else if (day < start) {
      setEnd(start)
      setStart(day)
    } else {
      setEnd(day)
    }
  }

  function jumpTo(range: DateRange) {
    setStart(range.start)
    setEnd(range.end)
    if (range.start) {
      setLeftYear(range.start.getFullYear())
      setLeftMonth(range.start.getMonth())
      const r = new Date(range.start.getFullYear(), range.start.getMonth() + 1, 1)
      setRightYear(r.getFullYear())
      setRightMonth(r.getMonth())
    }
  }

  function handlePreset(p: Preset) {
    setPreset(p)
    if (p === 'Set up') return
    const now = startOfDay(new Date())
    if (p === 'Today') {
      jumpTo({ start: now, end: now })
    } else if (p === 'This week') {
      const day = now.getDay()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - day)
      jumpTo({ start: weekStart, end: now })
    } else if (p === 'This month') {
      jumpTo({ start: new Date(now.getFullYear(), now.getMonth(), 1), end: now })
    } else if (p === 'This year') {
      jumpTo({ start: new Date(now.getFullYear(), 0, 1), end: now })
    }
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 flex w-[760px] max-w-[92vw] flex-col rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex divide-x divide-slate-100">
        <CalendarMonth
          year={leftYear}
          month={leftMonth}
          onPrevMonth={() => shiftLeft(-1, 'month')}
          onNextMonth={() => shiftLeft(1, 'month')}
          onPrevYear={() => shiftLeft(-1, 'year')}
          onNextYear={() => shiftLeft(1, 'year')}
          start={start}
          end={end}
          hoverDate={hoverDate}
          onSelect={handleSelect}
          onHover={setHoverDate}
        />
        <CalendarMonth
          year={rightYear}
          month={rightMonth}
          onPrevMonth={() => shiftRight(-1, 'month')}
          onNextMonth={() => shiftRight(1, 'month')}
          onPrevYear={() => shiftRight(-1, 'year')}
          onNextYear={() => shiftRight(1, 'year')}
          start={start}
          end={end}
          hoverDate={hoverDate}
          onSelect={handleSelect}
          onHover={setHoverDate}
        />
        <div className="w-40 shrink-0 space-y-1 px-3 py-4">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePreset(p)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  preset === p ? 'border-[#1B2A4A]' : 'border-slate-300'
                }`}
              >
                {preset === p && <span className="h-2 w-2 rounded-full bg-[#1B2A4A]" />}
              </span>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
            {formatMMDDYYYY(start)}
          </span>
          <span className="text-slate-300">–</span>
          <span className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
            {formatMMDDYYYY(end)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply({ start, end })}
            className="rounded-lg bg-[#1B2A4A] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#152140]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}