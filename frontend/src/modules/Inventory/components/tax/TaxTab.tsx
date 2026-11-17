import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Check,
  Download,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Upload,
  X,
} from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import toast from 'react-hot-toast'
import ReusableTable from '@/components/shared/ReusableTable'
import ImportDialog from '@/components/shared/ImportDialog'
import { Modal } from '@/components/shared/Modal'
import { useAuth } from '@/context/useAuth'
import {
  useCreateTaxConfig,
  useTaxConfigs,
  useUpdateTaxConfig,
  useUpdateTaxConfigStatus,
} from '@/hooks/useTaxConfigs'
import type {
  TaxConfig,
  TaxConfigPayload,
  TaxGroup,
  TaxStatus,
} from '@/services/inventory/productSetup/taxConfig.service'
import { exportToCSV } from '@/utils/exportData'
import { DrawerFooter, FieldWrap, SelectInput, TextInput, Toggle } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import { getTaxGroup, TAX_GROUP_OPTIONS } from './taxConfigConstants'

type TaxFormErrors = Partial<Record<keyof TaxConfigPayload, string>>

const requestErrorMessage = (
  error: unknown,
  fallback: string,
  conflictMessage?: string,
): string => {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    if (error.response?.status === 409 && conflictMessage) return conflictMessage

    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }

  return fallback
}

const getDateValue = (date: string) => {
  const isoDate = date.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (isoDate) return isoDate
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${parsedDate.getFullYear()}-${month}-${day}`
}

const formatHsnCode = (code: string) => {
  const digits = code.replace(/\s/g, '')
  if (digits.length === 4) return digits
  if (digits.length === 6) return `${digits.slice(0, 4)} ${digits.slice(4)}`
  if (digits.length === 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`
  }
  return digits
}

function TaxDrawer({
  isOpen,
  onClose,
  initialData,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  initialData: TaxConfig | null
  onSave: (payload: TaxConfigPayload) => Promise<void>
}) {
  const initialGroup = getTaxGroup(initialData?.taxGroup)
  const [taxGroup, setTaxGroup] = useState<TaxGroup>(initialGroup)
  const [hsnCode, setHsnCode] = useState(initialData?.hsnCode ?? '')
  const [gstSlab, setGstSlab] = useState(
    initialGroup === 'EXEMPT' ? '0' : initialData ? String(initialData.gstRate) : '',
  )
  const [cess, setCess] = useState(
    initialGroup === 'EXEMPT' ? '0' : initialData ? String(initialData.cessRate) : '0',
  )
  const [effectiveDate, setEffectiveDate] = useState(
    initialData ? getDateValue(initialData.effectiveFrom) : '',
  )
  const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false)
  const [errors, setErrors] = useState<TaxFormErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  const resetForm = () => {
    setTaxGroup('STANDARD')
    setHsnCode('')
    setGstSlab('')
    setCess('0')
    setEffectiveDate('')
    setIsDefault(false)
    setErrors({})
  }

  const isExempt = taxGroup === 'EXEMPT'
  const normalizedHsnCode = hsnCode.replace(/\s/g, '')
  const gstRate = gstSlab === '' ? Number.NaN : Number(gstSlab)

  const handleSubmit = async () => {
    const nextErrors: TaxFormErrors = {}
    if (!/^(?:\d{4}|\d{6}|\d{8})$/.test(normalizedHsnCode)) {
      nextErrors.hsnCode = 'HSN/SAC code must be 4, 6 or 8 digits'
    }

    const hasValidGst =
      gstSlab !== '' &&
      Number.isFinite(gstRate) &&
      gstRate >= 0 &&
      gstRate <= 100 &&
      /^\d+(?:\.\d{1,2})?$/.test(gstSlab)
    if (!hasValidGst) {
      nextErrors.gstRate =
        gstSlab === ''
          ? 'GST Slab is required'
          : 'Enter a value from 0 to 100 with up to 2 decimals'
    }

    const cessRate = cess === '' ? 0 : Number(cess)
    if (
      cess !== '' &&
      (!Number.isFinite(cessRate) ||
        cessRate < 0 ||
        cessRate > 100 ||
        !/^\d+(?:\.\d{1,2})?$/.test(cess))
    ) {
      nextErrors.cessRate = 'Enter a value from 0 to 100 with up to 2 decimals'
    }
    if (!effectiveDate) nextErrors.effectiveFrom = 'Effective Date is required'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSaving(true)
    try {
      await onSave({
        hsnCode: normalizedHsnCode,
        taxGroup,
        gstRate: isExempt ? 0 : gstRate,
        cessRate: isExempt ? 0 : cessRate,
        effectiveFrom: effectiveDate,
        isDefault,
        status: initialData?.status ?? 'ACTIVE',
      })
    } catch (error) {
      toast.error(
        requestErrorMessage(error, 'Unable to save tax configuration', 'HSN code already exists'),
      )
    } finally {
      setIsSaving(false)
    }
  }

  const closeForm = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeForm} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">
          {initialData ? `Edit Tax Configuration (${initialData.taxId})` : 'Create Tax Configuration'}
        </h3>
        <button
          type="button"
          onClick={closeForm}
          className="text-slate-400 hover:text-slate-600 transition"
          aria-label="Close"
        >
          <span aria-hidden className="text-xl leading-none">×</span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="mb-4">
          <SectionLabel>Tax Identity</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Tax ID">
            <TextInput value={initialData?.taxId ?? 'Auto-generated'} disabled />
          </FieldWrap>
          <FieldWrap label="Tax Group" required>
            <SelectInput
              options={TAX_GROUP_OPTIONS}
              value={taxGroup}
              onChange={(value) => {
                const nextGroup = getTaxGroup(value)
                setTaxGroup(nextGroup)
                if (nextGroup === 'EXEMPT') {
                  setGstSlab('0')
                  setCess('0')
                }
                setErrors((current) => ({ ...current, gstRate: undefined, cessRate: undefined }))
              }}
              placeholder="Select tax group"
            />
          </FieldWrap>
          <FieldWrap label="HSN/SAC Code" required>
            <TextInput
              value={hsnCode}
              onChange={(value) => {
                setHsnCode(value.replace(/[^\d ]/g, ''))
                setErrors((current) => ({ ...current, hsnCode: undefined }))
              }}
              placeholder="e.g. 8517 12 90"
            />
            {errors.hsnCode && <p className="text-xs text-red-600">{errors.hsnCode}</p>}
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Tax Rates</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="GST Slab %" required>
            <TextInput
              type="number"
              value={gstSlab}
              onChange={(value) => {
                setGstSlab(value)
                setErrors((current) => ({ ...current, gstRate: undefined }))
              }}
              disabled={isExempt}
              min={0}
              max={100}
              step={0.01}
              placeholder="0"
            />
            {errors.gstRate && <p className="text-xs text-red-600">{errors.gstRate}</p>}
          </FieldWrap>
          <FieldWrap label="CGST %">
            <TextInput value={gstSlab === '' ? '' : String(gstRate / 2)} disabled />
            <p className="text-xs text-slate-400">Calculated from GST Slab</p>
          </FieldWrap>
          <FieldWrap label="SGST %">
            <TextInput value={gstSlab === '' ? '' : String(gstRate / 2)} disabled />
            <p className="text-xs text-slate-400">Calculated from GST Slab</p>
          </FieldWrap>
          <FieldWrap label="IGST %">
            <TextInput value={gstSlab === '' ? '' : String(gstRate)} disabled />
            <p className="text-xs text-slate-400">Calculated from GST Slab</p>
          </FieldWrap>
          <FieldWrap label="CESS %">
            <TextInput
              type="number"
              value={cess}
              onChange={(value) => {
                setCess(value)
                setErrors((current) => ({ ...current, cessRate: undefined }))
              }}
              disabled={isExempt}
              min={0}
              max={100}
              step={0.01}
              placeholder="0"
            />
            {errors.cessRate && <p className="text-xs text-red-600">{errors.cessRate}</p>}
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Settings</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Effective Date" required>
            <TextInput
              type="date"
              value={effectiveDate}
              onChange={(value) => {
                setEffectiveDate(value)
                setErrors((current) => ({ ...current, effectiveFrom: undefined }))
              }}
            />
            {errors.effectiveFrom && (
              <p className="text-xs text-red-600">{errors.effectiveFrom}</p>
            )}
          </FieldWrap>
          <div className="flex items-end justify-between gap-3 pb-1">
            <span className="text-xs font-medium text-[#314158]">Default Tax</span>
            <Toggle checked={isDefault} onChange={setIsDefault} />
          </div>
        </div>
      </div>

      <DrawerFooter
        onCancel={closeForm}
        onPrimary={() => void handleSubmit()}
        primaryLabel={initialData ? 'Update' : 'Save'}
        primaryDisabled={isSaving}
      />
    </Modal>
  )
}

export default function TaxTab() {
  const { hasPermission } = useAuth()
  const canCreate = hasPermission('TAX_CREATE')
  const canEdit = hasPermission('TAX_EDIT')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaxStatus | undefined>()
  const [groupFilter, setGroupFilter] = useState<TaxGroup | undefined>()
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TaxConfig | null>(null)

  const filters = useMemo(
    () => ({ search: debouncedSearch, status: statusFilter, taxGroup: groupFilter }),
    [debouncedSearch, statusFilter, groupFilter],
  )
  const taxQuery = useTaxConfigs(filters)
  const taxConfigs = taxQuery.data ?? []
  const createMutation = useCreateTaxConfig()
  const updateMutation = useUpdateTaxConfig()
  const updateStatusMutation = useUpdateTaxConfigStatus()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timeoutId)
  }, [search])

  const openNewForm = () => {
    setEditingItem(null)
    setDrawerOpen(true)
  }

  const handleSave = async (payload: TaxConfigPayload) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload })
      toast.success(`Tax configuration "${editingItem.taxId}" updated successfully`)
    } else {
      const created = await createMutation.mutateAsync(payload)
      toast.success(`Tax configuration "${created.taxId}" created successfully`)
    }
    setDrawerOpen(false)
    setEditingItem(null)
  }

  const handleStatusChange = async (record: TaxConfig) => {
    const status = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await updateStatusMutation.mutateAsync({ id: record.id, status })
      toast.success(`Tax configuration ${status === 'ACTIVE' ? 'activated' : 'deactivated'}`)
    } catch (error) {
      toast.error(requestErrorMessage(error, 'Failed to update tax configuration status'))
    }
  }

  const handleExport = () => {
    exportToCSV(
      taxConfigs,
      [
        { header: 'Tax ID', accessor: (item) => item.taxId },
        { header: 'Product Code', accessor: (item) => item.products[0]?.code ?? '—' },
        {
          header: 'Product Name',
          accessor: (item) => {
            const firstProduct = item.products[0]
            if (!firstProduct) return '—'
            return `${firstProduct.name}${item.products.length > 1 ? ` +${item.products.length - 1} more` : ''}`
          },
        },
        { header: 'HSN Code', accessor: (item) => item.hsnCode },
        { header: 'GST Rate', accessor: (item) => `${item.gstRate}%` },
        { header: 'CGST Rate', accessor: (item) => `${item.cgstRate}%` },
        { header: 'SGST Rate', accessor: (item) => `${item.sgstRate}%` },
        { header: 'IGST Rate', accessor: (item) => `${item.igstRate}%` },
        { header: 'Tax Group', accessor: (item) => item.taxGroup },
        { header: 'Status', accessor: (item) => item.status },
      ],
      'tax-configuration.csv',
    )
    toast.success('Tax configuration exported to CSV')
  }

  const columns: ColumnsType<TaxConfig> = [
    {
      title: 'Tax ID',
      dataIndex: 'taxId',
      width: 105,
      render: (taxId: string, record) =>
        canEdit ? (
          <button
            type="button"
            onClick={() => {
              setEditingItem(record)
              setDrawerOpen(true)
            }}
            className="font-medium text-xs text-[#155DFC] hover:underline cursor-pointer"
          >
            {taxId}
          </button>
        ) : (
          <span className="font-medium text-xs text-slate-700">{taxId}</span>
        ),
    },
    {
      title: 'Product Code',
      width: 140,
      render: (_value: unknown, record) => (
        <span className="font-medium text-xs text-[#155DFC]">
          {record.products[0]?.code ?? '—'}
        </span>
      ),
    },
    {
      title: 'Product Name',
      width: 220,
      render: (_value: unknown, record) => {
        const firstProduct = record.products[0]
        if (!firstProduct) return <span className="text-xs text-slate-500">—</span>
        return (
          <span className="text-xs font-medium text-slate-800">
            {firstProduct.name}
            {record.products.length > 1 && ` +${record.products.length - 1} more`}
          </span>
        )
      },
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnCode',
      width: 120,
      render: (value: string) => (
        <span className="text-xs text-slate-600 font-mono tracking-wider">
          {formatHsnCode(value)}
        </span>
      ),
    },
    {
      title: 'GST %',
      dataIndex: 'gstRate',
      width: 85,
      render: (value: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{value}%</span>
      ),
    },
    ...([
      ['CGST %', 'cgstRate'],
      ['SGST %', 'sgstRate'],
      ['IGST %', 'igstRate'],
    ] as const).map(([title, dataIndex]) => ({
      title,
      dataIndex,
      width: 95,
      render: (value: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{value}%</span>
      ),
    })),
    {
      title: 'Tax Group',
      dataIndex: 'taxGroup',
      width: 130,
      render: (group: TaxGroup) => {
        const label = TAX_GROUP_OPTIONS.find((option) => option.value === group)?.label ?? group
        let dotColor = 'bg-slate-400'
        let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200'
        if (group === 'ESSENTIAL') {
          dotColor = 'bg-emerald-500'
          badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        } else if (group === 'PHARMA') {
          dotColor = 'bg-cyan-500'
          badgeClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200'
        } else if (group === 'EXEMPT') {
          dotColor = 'bg-amber-500'
          badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200'
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeClasses}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {label}
          </span>
        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 105,
      render: (status: TaxStatus) => {
        const isActive = status === 'ACTIVE'
        return (
          <span
            className={`flex items-center gap-1.5 text-xs font-medium ${
              isActive ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      },
    },
  ]

  if (canEdit) {
    columns.push({
      title: '',
      key: 'actions',
      width: 50,
      render: (_value: unknown, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <Pencil size={14} className="text-blue-600" />,
                label: <span className="text-xs font-medium text-slate-700">Edit</span>,
                onClick: () => {
                  setEditingItem(record)
                  setDrawerOpen(true)
                },
              },
              {
                key: 'status',
                label: (
                  <span className="text-xs font-medium text-slate-700">
                    {record.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </span>
                ),
                onClick: () => void handleStatusChange(record),
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label={`Actions for ${record.taxId}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      ),
    })
  }

  const activeFilters =
    (statusFilter ? (statusFilter === 'ACTIVE' ? 'Active' : 'Inactive') : '') ||
    (groupFilter ? TAX_GROUP_OPTIONS.find((option) => option.value === groupFilter)?.label : '')

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="mr-1">
            <h1 className="text-xl font-bold text-[#0F2A66] tracking-tight leading-tight">
              Tax Configuration
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {taxConfigs.length} records
            </p>
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search HSN code..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-48 sm:w-56 pl-9 pr-9 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu((visible) => !visible)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition shadow-2xs cursor-pointer ${
                activeFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ListFilter size={13} className="text-slate-500" />
              <span>Filters</span>
              {activeFilters && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                  {activeFilters}
                </span>
              )}
            </button>
            {showFilterMenu && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                <p className="px-3.5 py-1 text-[10px] font-semibold uppercase text-slate-400">
                  Status
                </p>
                {([
                  [undefined, 'All statuses'],
                  ['ACTIVE', 'Active'],
                  ['INACTIVE', 'Inactive'],
                ] as const).map(([status, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status)
                      setShowFilterMenu(false)
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 text-slate-700"
                  >
                    <span>{label}</span>
                    {statusFilter === status && <Check size={12} className="text-blue-600" />}
                  </button>
                ))}
                <p className="mt-1 border-t border-slate-100 px-3.5 pt-2 pb-1 text-[10px] font-semibold uppercase text-slate-400">
                  Tax Group
                </p>
                {([
                  [undefined, 'All groups'],
                  ...TAX_GROUP_OPTIONS.map((option) => [option.value, option.label] as const),
                ] as const).map(([group, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setGroupFilter(group)
                      setShowFilterMenu(false)
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 text-slate-700"
                  >
                    <span>{label}</span>
                    {groupFilter === group && <Check size={12} className="text-blue-600" />}
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
          {canCreate && (
            <button
              type="button"
              onClick={() => setImportDialogOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
            >
              <Download size={13} className="text-slate-500" />
              <span>Import</span>
            </button>
          )}
          {canCreate && (
            <button
              type="button"
              onClick={openNewForm}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#155DFC] hover:bg-blue-600 rounded-lg transition shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              <Plus size={14} />
              <span>New Tax Config</span>
            </button>
          )}
        </div>
      </div>

      {taxQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
          Loading tax configurations...
        </div>
      ) : taxQuery.isError ? (
        <div className="rounded-xl border border-slate-200 bg-white py-10 text-center">
          <p className="text-sm text-red-600">
            {requestErrorMessage(taxQuery.error, 'Failed to load tax configurations')}
          </p>
          <button
            type="button"
            onClick={() => void taxQuery.refetch()}
            className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      ) : taxConfigs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
          No tax configurations found
        </div>
      ) : (
        <ReusableTable
          columns={columns}
          data={taxConfigs}
          loading={taxQuery.isFetching}
          rowKey="id"
        />
      )}

      <TaxDrawer
        key={editingItem?.id ?? 'new'}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingItem(null)
        }}
        initialData={editingItem}
        onSave={handleSave}
      />
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        title="Import Tax Configurations"
        importUrl="/api/productSetup/tax-config/import"
        templateUrl="/api/productSetup/tax-config/import-template"
        templateFileName="tax-config-import-template.xlsx"
        invalidateKey={['tax-configs']}
      />
    </div>
  )
}
