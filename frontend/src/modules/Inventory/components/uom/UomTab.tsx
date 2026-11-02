import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ListFilter,
  Search,
  Upload,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToCSV } from '@/utils/exportData'
import {
  createUom,
  getUoms,
  updateUomStatus,
} from '@/services/inventory/productSetup/uom.service'
import type {
  CreateUomPayload,
  Uom,
  UomStatus,
} from '@/services/inventory/productSetup/uom.service'

const PAGE_SIZE = 12
const ROWS_PER_COLUMN = PAGE_SIZE / 2
type StatusFilter = 'All' | UomStatus

const requestErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    if (error.response?.status === 409) {
      return 'UOM code or name already exists'
    }

    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

export default function UomTab() {
  const [uoms, setUoms] = useState<Uom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [codeError, setCodeError] = useState('')
  const [nameError, setNameError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingStatusIds, setPendingStatusIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const loadUoms = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getUoms({
        search: debouncedSearch,
        status: statusFilter === 'All' ? undefined : statusFilter,
      })
      setUoms(data)
    } catch (error) {
      toast.error(requestErrorMessage(error, 'Failed to load UOMs'))
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUoms()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadUoms])

  const totalPages = Math.max(1, Math.ceil(uoms.length / PAGE_SIZE))
  const activePage = Math.min(currentPage, totalPages)
  const startIndex = (activePage - 1) * PAGE_SIZE
  const currentUoms = useMemo(
    () => uoms.slice(startIndex, startIndex + PAGE_SIZE),
    [startIndex, uoms],
  )
  const firstColumn = currentUoms.slice(0, ROWS_PER_COLUMN)
  const secondColumn = currentUoms.slice(ROWS_PER_COLUMN)

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = codeInput.trim()
    const name = nameInput.trim()
    const hasCodeError = !code
    const hasNameError = !name || name.length > 50
    setCodeError(hasCodeError ? 'UOM Code is required' : '')
    setNameError(
      !name ? 'UOM Name is required' : hasNameError ? 'UOM Name must be 50 characters or fewer' : '',
    )

    if (hasCodeError || hasNameError) return

    setIsSubmitting(true)
    try {
      const payload: CreateUomPayload = { code, name }
      await createUom(payload)
      toast.success(`UOM "${name}" created successfully`)
      setCodeInput('')
      setNameInput('')
      setCodeError('')
      setNameError('')
      setCurrentPage(1)
      await loadUoms()
    } catch (error) {
      toast.error(requestErrorMessage(error, 'Failed to create UOM'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggle = async (item: Uom, isActive: boolean) => {
    const previousStatus = item.status
    const nextStatus: UomStatus = isActive ? 'ACTIVE' : 'INACTIVE'

    setPendingStatusIds((ids) => [...ids, item.id])
    setUoms((items) =>
      items.map((uom) => (uom.id === item.id ? { ...uom, status: nextStatus } : uom)),
    )

    try {
      await updateUomStatus(item.id, nextStatus)
      await loadUoms()
    } catch (error) {
      setUoms((items) =>
        items.map((uom) =>
          uom.id === item.id ? { ...uom, status: previousStatus } : uom,
        ),
      )
      toast.error(requestErrorMessage(error, 'Failed to update UOM status'))
    } finally {
      setPendingStatusIds((ids) => ids.filter((id) => id !== item.id))
    }
  }

  const handleCancel = () => {
    setCodeInput('')
    setNameInput('')
    setCodeError('')
    setNameError('')
  }

 

 
  // Export handler
  const handleExport = () => {
    exportToCSV(
      uoms,
      [
        { header: 'ID', accessor: (uom) => uom.id },
        { header: 'UOM Code', accessor: (uom) => uom.code },
        { header: 'UOM Name', accessor: (uom) => uom.name },
        { header: 'Status', accessor: (uom) => uom.status },
      ],
      'uom-master.csv',
    )
    toast.success('UOM data exported successfully')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      toast.success(`File "${file.name}" imported successfully`)
    }
    event.target.value = ''
  }

  const renderColumn = (items: Uom[]) => (
    <div>
      <div className="flex items-end justify-between pb-2 mb-1">
        <div className="flex-1 mr-4">
          <span className="text-xs font-semibold text-slate-500 block pb-1 border-b border-slate-200">
            UOM Code / Name
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500 pb-1">Status</span>
      </div>

      <div className="divide-y divide-transparent">
        {items.map((item) => {
          const isActive = item.status === 'ACTIVE'
          const isPending = pendingStatusIds.includes(item.id)

          return (
            <div
              key={item.id}
              className="group flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors hover:bg-slate-50/80 text-slate-700"
            >
              <div className="mr-3 min-w-0">
                <span className="block text-[13px] font-semibold text-slate-800 tracking-tight">
                  {item.code}
                </span>
                <span className="block text-xs text-slate-500">{item.name}</span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    isActive ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-label={`Set ${item.name} ${isActive ? 'inactive' : 'active'}`}
                  aria-checked={isActive}
                  disabled={isPending}
                  onClick={() => void handleToggle(item, !isActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-wait ${
                    isActive ? 'bg-[#155DFC]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-[3px] ${
                      isActive ? 'translate-x-[19px]' : 'translate-x-[3px]'
                    }`}
                  />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="w-full pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="mr-1">
            <h1 className="text-xl font-bold text-[#0F2A66] tracking-tight leading-tight">
              UOM Master
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {uoms.length} records
            </p>
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setCurrentPage(1)
              }}
              className="w-48 sm:w-56 pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu((visible) => !visible)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition shadow-2xs ${
                statusFilter !== 'All'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ListFilter size={13} className="text-slate-500" />
              <span>Filters</span>
              {statusFilter !== 'All' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                  {statusFilter === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              )}
            </button>
            {showFilterMenu && (
              <div className="absolute left-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                {(['All', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status)
                      setCurrentPage(1)
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      statusFilter === status
                        ? 'font-semibold text-blue-600 bg-blue-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>
                      {status === 'All' ? 'All' : status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                    {statusFilter === status && <Check size={12} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
          >
            <Upload size={13} className="text-slate-500" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Import</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-400">Loading UOMs...</div>
          ) : uoms.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No matching UOMs found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12">
              {renderColumn(firstColumn)}
              <div className="mt-4 md:mt-0">{renderColumn(secondColumn)}</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col justify-between min-h-[520px]">
          <form onSubmit={handleSave} noValidate>
            <div className="p-6 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-bold text-[#043793] tracking-tight">
                Create UOM
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="uom-code"
                  className="block text-xs font-semibold text-slate-700 mb-2"
                >
                  UOM Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="uom-code"
                  type="text"
                  placeholder="e.g. KG"
                  value={codeInput}
                  maxLength={10}
                  required
                  aria-invalid={Boolean(codeError)}
                  aria-describedby={codeError ? 'uom-code-error' : undefined}
                  onChange={(event) => {
                    setCodeInput(event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))
                    if (codeError) setCodeError('')
                  }}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#155DFC] transition shadow-2xs"
                />
                {codeError && (
                  <p id="uom-code-error" className="mt-1 text-xs text-red-600">
                    {codeError}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="uom-name"
                  className="block text-xs font-semibold text-slate-700 mb-2"
                >
                  UOM Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="uom-name"
                  type="text"
                  placeholder="e.g. Kilogram"
                  value={nameInput}
                  maxLength={50}
                  required
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? 'uom-name-error' : undefined}
                  onChange={(event) => {
                    setNameInput(event.target.value)
                    if (nameError) setNameError('')
                  }}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#155DFC] transition shadow-2xs"
                />
                {nameError && (
                  <p id="uom-name-error" className="mt-1 text-xs text-red-600">
                    {nameError}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-2.5 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#155DFC] hover:bg-blue-600 rounded-lg shadow-sm transition cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={14} className="stroke-[2.5]" />
                <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 px-1">
        <span className="text-xs text-slate-500 font-normal">
          Showing {uoms.length === 0 ? 0 : startIndex + 1}–
          {Math.min(startIndex + currentUoms.length, uoms.length)} of {uoms.length} records
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed text-xs"
            aria-label="Previous page"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="w-7 h-7 flex items-center justify-center rounded bg-[#155DFC] text-white font-semibold text-xs shadow-2xs">
            {activePage}
          </span>
          <button
            type="button"
            disabled={activePage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed text-xs"
            aria-label="Next page"
          >
            <ChevronRight size={13} />
          </button>
          <div className="ml-2 w-16 h-7 border border-slate-200 rounded bg-white flex items-center justify-center text-xs text-slate-500 font-medium">
            {PAGE_SIZE}
          </div>
        </div>
      </div>
    </div>
  )
}