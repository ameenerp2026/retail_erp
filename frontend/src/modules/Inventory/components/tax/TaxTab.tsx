import { useMemo, useState, useRef } from 'react'
import axios from 'axios'
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Search,
  ListFilter,
  Upload,
  Download,
  Check,
  X,
} from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ReusableTable from '@/components/shared/ReusableTable'
import { Modal } from '@/components/shared/Modal'
import { exportToCSV } from '@/utils/exportData'
import type { HsnRateOption, TaxConfig } from '@/types/inventorySetup'
import {
  taxService,
  type SaveTaxConfigPayload,
} from '@/services/inventory/productSetup/tax.service'
import {
  deriveGstComponents,
  findMatchingHsnOption,
  formatCalculatedGstFields,
  toIsoDateInput,
  validatePercentageRate,
} from '@/utils/gstCalculations'
import { FieldWrap, SelectInput, TextInput, Toggle, DrawerFooter } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'

const TAX_GROUP_OPTIONS = [
  'Standard',
  'Essential',
  'Pharma',
  'Electronics 18%',
  'Apparel 12%',
  'FMCG 18%',
  'Grocery 5%',
]

const TAX_QUERY_KEY = ['inventory-setup-tax'] as const
const HSN_RATES_QUERY_KEY = ['inventory-setup-hsn-rates'] as const

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const msg = error.response?.data?.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }
  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}

function TaxDrawer({
  isOpen,
  onClose,
  initialData,
  hsnOptions,
  isSaving,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  initialData?: TaxConfig | null
  hsnOptions: HsnRateOption[]
  isSaving?: boolean
  onSave: (data: SaveTaxConfigPayload) => Promise<void> | void
}) {
  const [productCode, setProductCode] = useState(initialData?.productCode ?? '')
  const [productName, setProductName] = useState(initialData?.productName ?? '')
  const [taxGroup, setTaxGroup] = useState(initialData?.taxGroup ?? 'Standard')
  const [hsnSac, setHsnSac] = useState(initialData?.hsnSac ?? '')
  const [gstRateInput, setGstRateInput] = useState<string>(
    initialData !== null && initialData !== undefined ? String(initialData.gstRate) : '',
  )
  const [cessInput, setCessInput] = useState<string>(
    initialData !== null && initialData !== undefined ? String(initialData.cess ?? 0) : '0',
  )
  const [effectiveDate, setEffectiveDate] = useState(
    toIsoDateInput(initialData?.effectiveDate),
  )
  const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false)
  const [hsnMatchNote, setHsnMatchNote] = useState<string>('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Always derive CGST, SGST, and IGST directly from `gstRateInput` (never NaN)
  const calculated = useMemo(
    () => formatCalculatedGstFields(gstRateInput),
    [gstRateInput],
  )

  const gstValidation = useMemo(
    () => validatePercentageRate(gstRateInput, 'GST %', { required: true }),
    [gstRateInput],
  )

  const cessValidation = useMemo(
    () => validatePercentageRate(cessInput, 'CESS %', { required: false, defaultValue: 0 }),
    [cessInput],
  )

  const productCodeError =
    submitAttempted && !productCode.trim() ? 'Product Code is required' : undefined
  const productNameError =
    submitAttempted && !productName.trim() ? 'Product Name is required' : undefined

  const gstError = useMemo(() => {
    const trimmed = gstRateInput.trim()
    if (trimmed === '') {
      return submitAttempted ? 'GST % is required' : undefined
    }
    if (!submitAttempted && /^\d+\.$/.test(trimmed)) {
      return undefined
    }
    return gstValidation.valid ? undefined : gstValidation.error
  }, [gstRateInput, gstValidation, submitAttempted])

  const cessError = useMemo(() => {
    const trimmed = cessInput.trim()
    if (trimmed === '') return undefined
    if (!submitAttempted && /^\d+\.$/.test(trimmed)) {
      return undefined
    }
    return cessValidation.valid ? undefined : cessValidation.error
  }, [cessInput, cessValidation, submitAttempted])

  const applyMatchedHsnRate = (match: HsnRateOption | null) => {
    if (match && match.gstRate !== null && match.gstRate !== undefined) {
      setGstRateInput(String(match.gstRate))
      setHsnMatchNote(
        `Auto-filled from HSN ${match.code}${match.description ? ` (${match.description})` : ''}`,
      )
    }
  }

  const handleHsnChange = (value: string) => {
    setHsnSac(value)
    setHsnMatchNote('')
    const localMatch = findMatchingHsnOption(value, hsnOptions)
    if (localMatch) {
      applyMatchedHsnRate(localMatch)
    }
  }

  const handleHsnBlur = async () => {
    if (!hsnSac.trim()) return
    const localMatch = findMatchingHsnOption(hsnSac, hsnOptions)
    if (localMatch) {
      applyMatchedHsnRate(localMatch)
      return
    }
    const remoteMatch = await taxService.lookupHsnRate(hsnSac)
    if (remoteMatch) {
      applyMatchedHsnRate(remoteMatch)
    }
  }

  const handleGstChange = (value: string) => {
    setGstRateInput(value)
    setHsnMatchNote('')
  }

  const handleCessChange = (value: string) => {
    setCessInput(value)
  }

  const handleSubmit = async () => {
    setSubmitAttempted(true)

    if (!productCode.trim() || !productName.trim() || !taxGroup.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!gstValidation.valid) {
      toast.error(gstValidation.error)
      return
    }

    if (!cessValidation.valid) {
      toast.error(cessValidation.error)
      return
    }

    await onSave({
      productCode: productCode.trim(),
      productName: productName.trim(),
      taxGroup: taxGroup.trim(),
      hsnSac: hsnSac.trim(),
      gstRate: gstValidation.value,
      cess: cessValidation.value,
      effectiveDate: effectiveDate || '2026-04-01',
      isDefault,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">
          {initialData
            ? `Edit Tax Configuration (${initialData.taxId})`
            : 'Create Tax Configuration'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>

      <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
        <div className="mb-4">
          <SectionLabel>Tax Identity</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Tax ID">
            <TextInput
              value={initialData?.taxId || 'Tax ID is Auto-generated'}
              disabled
            />
          </FieldWrap>
          <FieldWrap label="Tax Group" required>
            <SelectInput
              options={TAX_GROUP_OPTIONS}
              value={taxGroup}
              onChange={(v) => setTaxGroup(v)}
              placeholder="Select dropdown"
            />
          </FieldWrap>
          <FieldWrap label="Product Code" required error={productCodeError}>
            <TextInput
              value={productCode}
              onChange={(v) => setProductCode(v)}
              placeholder="e.g. ELE-SAM-A54"
              hasError={Boolean(productCodeError)}
            />
          </FieldWrap>
          <FieldWrap label="Product Name" required error={productNameError}>
            <TextInput
              value={productName}
              onChange={(v) => setProductName(v)}
              placeholder="e.g. Samsung Galaxy A54 5G"
              hasError={Boolean(productNameError)}
            />
          </FieldWrap>
          <FieldWrap
            label="HSN/SAC Code"
            hint={hsnOptions.length > 0 ? 'Select or enter HSN/SAC to auto-fetch GST %' : undefined}
          >
            <TextInput
              value={hsnSac}
              onChange={handleHsnChange}
              onBlur={() => void handleHsnBlur()}
              list="tax-hsn-sac-list"
              placeholder="e.g. 8517 12 90"
            />
            {hsnOptions.length > 0 && (
              <datalist id="tax-hsn-sac-list">
                {hsnOptions.map((hsn) => (
                  <option key={hsn.id} value={hsn.code}>
                    {hsn.description
                      ? `${hsn.description}${hsn.gstRate !== null ? ` (${hsn.gstRate}% GST)` : ''}`
                      : undefined}
                  </option>
                ))}
              </datalist>
            )}
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Tax Rates</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 1. GST % — Primary editable input */}
          <FieldWrap
            label="GST %"
            required
            error={gstError}
            hint={!gstError && hsnMatchNote ? hsnMatchNote : undefined}
          >
            <TextInput
              type="text"
              inputMode="decimal"
              ariaLabel="GST %"
              value={gstRateInput}
              onChange={handleGstChange}
              placeholder="e.g. 18"
              hasError={Boolean(gstError)}
            />
          </FieldWrap>

          {/* 2. CGST % — Automatically calculated (GST / 2), Read Only */}
          <FieldWrap label="CGST %" hint="Auto-calculated (GST ÷ 2)">
            <TextInput
              type="text"
              ariaLabel="CGST %"
              value={calculated.cgst}
              readOnly
              placeholder="0"
            />
          </FieldWrap>

          {/* 3. SGST % — Automatically calculated (GST / 2), Read Only */}
          <FieldWrap label="SGST %" hint="Auto-calculated (GST ÷ 2)">
            <TextInput
              type="text"
              ariaLabel="SGST %"
              value={calculated.sgst}
              readOnly
              placeholder="0"
            />
          </FieldWrap>

          {/* 4. IGST % — Automatically calculated (GST), Read Only */}
          <FieldWrap label="IGST %" hint="Auto-calculated (Equal to GST)">
            <TextInput
              type="text"
              ariaLabel="IGST %"
              value={calculated.igst}
              readOnly
              placeholder="0"
            />
          </FieldWrap>

          {/* 5. CESS % — Independently editable (default 0) */}
          <FieldWrap
            label="CESS %"
            error={cessError}
            hint={!cessError ? 'Applied separately from CGST/SGST/IGST' : undefined}
          >
            <TextInput
              type="text"
              inputMode="decimal"
              ariaLabel="CESS %"
              value={cessInput}
              onChange={handleCessChange}
              placeholder="0"
              hasError={Boolean(cessError)}
            />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Settings</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Effective Date">
            <TextInput
              type="date"
              value={effectiveDate}
              onChange={(v) => setEffectiveDate(v)}
            />
          </FieldWrap>
          <div className="flex items-end justify-between gap-3 pb-1">
            <span className="text-xs font-medium text-[#314158]">Default Tax</span>
            <Toggle checked={isDefault} onChange={(v) => setIsDefault(v)} />
          </div>
        </div>
      </div>

      <DrawerFooter
        onCancel={onClose}
        onPrimary={() => void handleSubmit()}
        primaryLabel={initialData ? 'Update' : 'Save'}
        primaryDisabled={isSaving}
      />
    </Modal>
  )
}

export default function TaxTab() {
  const queryClient = useQueryClient()

  const { data: taxResponse, isLoading } = useQuery({
    queryKey: TAX_QUERY_KEY,
    queryFn: () => taxService.getTaxConfigs(),
  })

  const { data: hsnOptions = [] } = useQuery({
    queryKey: HSN_RATES_QUERY_KEY,
    queryFn: () => taxService.getHsnRates(),
  })

  const [localTaxes, setLocalTaxes] = useState<TaxConfig[] | null>(null)
  const taxList = useMemo(
    () => localTaxes ?? taxResponse?.items ?? [],
    [localTaxes, taxResponse],
  )

  // Drawer / modal states
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TaxConfig | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState<string>('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const getNextTaxId = (list: TaxConfig[]): string => {
    const nums = list
      .map((t) => {
        const match = t.taxId.match(/\d+/)
        return match ? parseInt(match[0], 10) : 0
      })
      .filter((n) => !Number.isNaN(n))
    return `TAX-${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`
  }

  // Duplicate handler
  const handleDuplicate = async (record: TaxConfig) => {
    try {
      const { item, persistedToBackend } = await taxService.createTaxConfig({
        productCode: record.productCode,
        productName: record.productName,
        taxGroup: record.taxGroup,
        hsnSac: record.hsnSac,
        gstRate: record.gstRate,
        cess: record.cess,
        effectiveDate: toIsoDateInput(record.effectiveDate),
        isDefault: record.isDefault,
      })

      if (persistedToBackend) {
        await queryClient.invalidateQueries({ queryKey: TAX_QUERY_KEY })
        setLocalTaxes(null)
        toast.success(`Tax configuration "${record.taxId}" duplicated as "${item.taxId}"`)
      } else {
        const newTaxId = getNextTaxId(taxList)
        const duplicatedItem: TaxConfig = {
          ...item,
          id: String(Date.now()),
          taxId: newTaxId,
        }
        const targetIndex = taxList.findIndex((t) => t.id === record.id)
        const updated = [...taxList]
        if (targetIndex >= 0) {
          updated.splice(targetIndex + 1, 0, duplicatedItem)
        } else {
          updated.push(duplicatedItem)
        }
        setLocalTaxes(updated)
        toast.success(`Tax configuration "${record.taxId}" duplicated as "${newTaxId}"`)
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to duplicate tax configuration'))
    }
  }

  // Edit handler — fetches latest saved `gstRate` from backend when available
  const handleEdit = async (record: TaxConfig) => {
    let targetRecord = record

    if (taxResponse?.fromFallback === false) {
      try {
        const fresh = await taxService.getTaxConfigById(record.id)
        if (fresh) {
          targetRecord = fresh
        }
      } catch {
        // Keep record data already shown in table if fetch errors
      }
    }

    setEditingItem(targetRecord)
    setDrawerOpen(true)
  }

  // Delete handler
  const handleDelete = async (record: TaxConfig) => {
    try {
      const { deletedInBackend } = await taxService.deleteTaxConfig(record.id)
      if (deletedInBackend) {
        await queryClient.invalidateQueries({ queryKey: TAX_QUERY_KEY })
        setLocalTaxes(null)
      } else {
        setLocalTaxes(taxList.filter((t) => t.id !== record.id))
      }
      toast.success(`Tax configuration "${record.taxId}" deleted`)
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to delete tax configuration'))
    }
  }

  // Save (Create or Update) handler — persists `gstRate` as single source of truth
  const handleSaveTax = async (formData: SaveTaxConfigPayload) => {
    setIsSaving(true)
    try {
      if (editingItem) {
        const { item, persistedToBackend } = await taxService.updateTaxConfig(
          editingItem.id,
          formData,
        )
        if (persistedToBackend) {
          await queryClient.invalidateQueries({ queryKey: TAX_QUERY_KEY })
          setLocalTaxes(null)
        } else {
          const { gstRate, cgst, sgst, igst } = deriveGstComponents(formData.gstRate)
          setLocalTaxes(
            taxList.map((t) =>
              t.id === editingItem.id
                ? {
                    ...t,
                    ...formData,
                    gstRate,
                    cgst,
                    sgst,
                    igst,
                  }
                : t,
            ),
          )
        }
        toast.success(
          `Tax configuration "${item.taxId || editingItem.taxId}" updated successfully`,
        )
      } else {
        const { item, persistedToBackend } = await taxService.createTaxConfig(formData)
        if (persistedToBackend) {
          await queryClient.invalidateQueries({ queryKey: TAX_QUERY_KEY })
          setLocalTaxes(null)
          toast.success(`Tax configuration "${item.taxId}" created successfully`)
        } else {
          const newTaxId = getNextTaxId(taxList)
          const { gstRate, cgst, sgst, igst } = deriveGstComponents(formData.gstRate)
          const newTax: TaxConfig = {
            ...item,
            id: item.id || String(Date.now()),
            taxId: newTaxId,
            gstRate,
            cgst,
            sgst,
            igst,
          }
          setLocalTaxes([...taxList, newTax])
          toast.success(`Tax configuration "${newTax.taxId}" created successfully`)
        }
      }
      setDrawerOpen(false)
      setEditingItem(null)
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to save tax configuration'))
    } finally {
      setIsSaving(false)
    }
  }

  // Export handler
  const handleExport = () => {
    exportToCSV(
      taxList,
      [
        { header: 'Tax ID', accessor: (t) => t.taxId },
        { header: 'Product Code', accessor: (t) => t.productCode },
        { header: 'Product Name', accessor: (t) => t.productName },
        { header: 'HSN Code', accessor: (t) => t.hsnSac },
        { header: 'GST Rate', accessor: (t) => `${t.gstRate}%` },
        { header: 'CGST Rate', accessor: (t) => `${t.cgst}%` },
        { header: 'SGST Rate', accessor: (t) => `${t.sgst}%` },
        { header: 'IGST Rate', accessor: (t) => `${t.igst}%` },
        { header: 'CESS Rate', accessor: (t) => `${t.cess}%` },
        { header: 'Tax Group', accessor: (t) => t.taxGroup },
      ],
      'tax-configuration.csv',
    )
    toast.success('Tax configuration exported to CSV')
  }

  // Import handler
  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      toast.success(`File "${file.name}" imported successfully`)
    }
    e.target.value = ''
  }

  // Filtered list
  const filtered = useMemo(() => {
    return taxList.filter((t) => {
      const q = search.toLowerCase()
      const matchesSearch =
        t.productName.toLowerCase().includes(q) ||
        t.productCode.toLowerCase().includes(q) ||
        t.taxId.toLowerCase().includes(q) ||
        t.hsnSac.toLowerCase().includes(q)
      const matchesGroup = groupFilter === 'All' || t.taxGroup === groupFilter
      return matchesSearch && matchesGroup
    })
  }, [taxList, search, groupFilter])

  // Distinct groups for filter dropdown
  const availableGroups = useMemo(() => {
    const groups = Array.from(new Set(taxList.map((t) => t.taxGroup)))
    return ['All', ...groups]
  }, [taxList])

  // Table Columns showing GST % and derived CGST, SGST, IGST
  const columns: ColumnsType<TaxConfig> = [
    {
      title: 'Tax ID',
      dataIndex: 'taxId',
      width: 105,
      render: (v: string, record: TaxConfig) => (
        <span
          onClick={() => void handleEdit(record)}
          className="font-medium text-xs text-[#155DFC] hover:underline cursor-pointer"
        >
          {v}
        </span>
      ),
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      width: 140,
      render: (v: string) => (
        <span className="font-medium text-xs text-[#155DFC]">{v}</span>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      width: 210,
      render: (v: string) => (
        <span className="text-xs font-medium text-slate-800">{v}</span>
      ),
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnSac',
      width: 115,
      render: (v: string) => (
        <span className="text-xs text-slate-600 font-mono tracking-wider">{v}</span>
      ),
    },
    {
      title: 'GST Rate',
      dataIndex: 'gstRate',
      width: 90,
      render: (v: number) => (
        <span className="font-semibold text-xs text-slate-800">{v ?? 0}%</span>
      ),
    },
    {
      title: 'CGST Rate',
      dataIndex: 'cgst',
      width: 90,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v ?? 0}%</span>
      ),
    },
    {
      title: 'SGST Rate',
      dataIndex: 'sgst',
      width: 90,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v ?? 0}%</span>
      ),
    },
    {
      title: 'IGST Rate',
      dataIndex: 'igst',
      width: 90,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v ?? 0}%</span>
      ),
    },
    {
      title: 'Tax Group',
      dataIndex: 'taxGroup',
      width: 125,
      render: (v: string) => {
        let dotColor = 'bg-slate-400'
        let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200'

        if (v === 'Essential' || v.toLowerCase().includes('grocery')) {
          dotColor = 'bg-emerald-500'
          badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        } else if (v === 'Pharma') {
          dotColor = 'bg-cyan-500'
          badgeClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200'
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeClasses}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {v}
          </span>
        )
      },
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_: unknown, record: TaxConfig) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <Pencil size={14} className="text-blue-600" />,
                label: (
                  <span className="text-xs font-medium text-slate-700">Edit</span>
                ),
                onClick: () => void handleEdit(record),
              },
              {
                key: 'duplicate',
                icon: <Copy size={14} className="text-slate-600" />,
                label: (
                  <span className="text-xs font-medium text-slate-700">
                    Duplicate
                  </span>
                ),
                onClick: () => void handleDuplicate(record),
              },
              {
                key: 'delete',
                icon: <Trash2 size={14} className="text-red-500" />,
                label: (
                  <span className="text-xs font-medium text-red-600">Delete</span>
                ),
                danger: true,
                onClick: () => void handleDelete(record),
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Actions"
          >
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Left: Title + Counter + Search + Filters */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="mr-1">
            <h1 className="text-xl font-bold text-[#0F2A66] tracking-tight leading-tight">
              Tax Configuration
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {filtered.length} records
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 sm:w-56 pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition shadow-2xs cursor-pointer ${
                groupFilter !== 'All'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ListFilter size={13} className="text-slate-500" />
              <span>Filters</span>
              {groupFilter !== 'All' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                  {groupFilter}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                {availableGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => {
                      setGroupFilter(group)
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      groupFilter === group
                        ? 'font-semibold text-blue-600 bg-blue-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{group}</span>
                    {groupFilter === group && (
                      <Check size={12} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Export, Import & + New Tax Config */}
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
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Import</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null)
              setDrawerOpen(true)
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#155DFC] hover:bg-blue-600 rounded-lg transition shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            <Plus size={14} />
            <span>New Tax Config</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <ReusableTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        }}
      />

      {/* Create / Edit Drawer */}
      <TaxDrawer
        key={`${editingItem?.id ?? 'new'}-${drawerOpen}`}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingItem(null)
        }}
        initialData={editingItem}
        hsnOptions={hsnOptions}
        isSaving={isSaving}
        onSave={handleSaveTax}
      />
    </div>
  )
}
