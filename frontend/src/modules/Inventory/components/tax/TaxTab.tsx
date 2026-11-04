import { useMemo, useState, useRef } from 'react'
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
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { TaxConfig } from '@/types/inventorySetup'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput, Toggle, DrawerFooter } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import toast from 'react-hot-toast'
import { exportToCSV } from '@/utils/exportData'

const TAX_GROUP_OPTIONS = [
  'Standard',
  'Essential',
  'Pharma',
  'Electronics 18%',
  'Apparel 12%',
  'FMCG 18%',
  'Grocery 5%',
]

function TaxDrawer({
  isOpen,
  onClose,
  initialData,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  initialData?: TaxConfig | null
  onSave: (data: Partial<TaxConfig>) => void
}) {
  const [productCode, setProductCode] = useState(initialData?.productCode || '')
  const [productName, setProductName] = useState(initialData?.productName || '')
  const [taxGroup, setTaxGroup] = useState(initialData?.taxGroup || 'Standard')
  const [hsnSac, setHsnSac] = useState(initialData?.hsnSac || '8517 12 90')
  const [cgst, setCgst] = useState(initialData?.cgst ?? 18)
  const [sgst, setSgst] = useState(initialData?.sgst ?? 18)
  const [igst, setIgst] = useState(initialData?.igst ?? 18)
  const [cess, setCess] = useState(initialData?.cess ?? 0)
  const [effectiveDate, setEffectiveDate] = useState(initialData?.effectiveDate || '2026-04-01')
  const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false)

  // Sync state if initialData changes
  const prevIdRef = useRef(initialData?.id)
  if (initialData?.id !== prevIdRef.current) {
    prevIdRef.current = initialData?.id
    setProductCode(initialData?.productCode || '')
    setProductName(initialData?.productName || '')
    setTaxGroup(initialData?.taxGroup || 'Standard')
    setHsnSac(initialData?.hsnSac || '8517 12 90')
    setCgst(initialData?.cgst ?? 18)
    setSgst(initialData?.sgst ?? 18)
    setIgst(initialData?.igst ?? 18)
    setCess(initialData?.cess ?? 0)
    setEffectiveDate(initialData?.effectiveDate || '2026-04-01')
    setIsDefault(initialData?.isDefault ?? false)
  }

  const handleSubmit = () => {
    onSave({
      productCode: productCode || 'PRD-001',
      productName: productName || 'Product Item',
      taxGroup,
      hsnSac,
      cgst: Number(cgst),
      sgst: Number(sgst),
      igst: Number(igst),
      cess: Number(cess),
      effectiveDate,
      isDefault,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">
          {initialData ? `Edit Tax Configuration (${initialData.taxId})` : 'Create Tax Configuration'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
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
          <FieldWrap label="Product Code" required>
            <TextInput
              value={productCode}
              onChange={(v) => setProductCode(v)}
              placeholder="e.g. ELE-SAM-A54"
            />
          </FieldWrap>
          <FieldWrap label="Product Name" required>
            <TextInput
              value={productName}
              onChange={(v) => setProductName(v)}
              placeholder="e.g. Samsung Galaxy A54 5G"
            />
          </FieldWrap>
          <FieldWrap label="HSN/SAC Code">
            <TextInput
              value={hsnSac}
              onChange={(v) => setHsnSac(v)}
              placeholder="e.g. 8517 12 90"
            />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Tax Rates</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="CGST %">
            <TextInput
              type="number"
              value={cgst}
              onChange={(v) => setCgst(Number(v))}
              placeholder="0"
            />
          </FieldWrap>
          <FieldWrap label="SGST %">
            <TextInput
              type="number"
              value={sgst}
              onChange={(v) => setSgst(Number(v))}
              placeholder="0"
            />
          </FieldWrap>
          <FieldWrap label="IGST %">
            <TextInput
              type="number"
              value={igst}
              onChange={(v) => setIgst(Number(v))}
              placeholder="0"
            />
          </FieldWrap>
          <FieldWrap label="CESS %">
            <TextInput
              type="number"
              value={cess}
              onChange={(v) => setCess(Number(v))}
              placeholder="0"
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
        onPrimary={handleSubmit}
        primaryLabel={initialData ? 'Update' : 'Save'}
      />
    </Modal>
  )
}

export default function TaxTab() {
  const { data: initialTaxes = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-tax'],
    queryFn: inventorySetupService.getTaxConfigs,
  })

  const [taxList, setTaxList] = useState<TaxConfig[]>([])
  const [initialized, setInitialized] = useState(false)

  // Drawer / modal states
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TaxConfig | null>(null)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState<string>('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync initial query data
  if (!initialized && initialTaxes.length > 0) {
    setTaxList(initialTaxes)
    setInitialized(true)
  }

  // Duplicate handler
  const handleDuplicate = (record: TaxConfig) => {
    // Determine next sequential TAX ID (e.g. TAX-008, TAX-009)
    const currentTaxNumbers = taxList
      .map((t) => {
        const match = t.taxId.match(/\d+/)
        return match ? parseInt(match[0], 10) : 0
      })
      .filter((n) => !isNaN(n))
    const nextNum = (Math.max(0, ...currentTaxNumbers) + 1).toString().padStart(3, '0')
    const newTaxId = `TAX-${nextNum}`

    const duplicatedItem: TaxConfig = {
      ...record,
      id: String(Date.now()),
      taxId: newTaxId,
      productName: record.productName,
    }

    const targetIndex = taxList.findIndex((t) => t.id === record.id)
    if (targetIndex >= 0) {
      const updated = [...taxList]
      updated.splice(targetIndex + 1, 0, duplicatedItem)
      setTaxList(updated)
    } else {
      setTaxList((prev) => [...prev, duplicatedItem])
    }

    toast.success(`Tax configuration "${record.taxId}" duplicated as "${newTaxId}"`)
  }

  // Edit handler
  const handleEdit = (record: TaxConfig) => {
    setEditingItem(record)
    setDrawerOpen(true)
  }

  // Delete handler
  const handleDelete = (record: TaxConfig) => {
    setTaxList((prev) => prev.filter((t) => t.id !== record.id))
    toast.success(`Tax configuration "${record.taxId}" deleted`)
  }

  // Save (Create or Update) handler
  const handleSaveTax = (formData: Partial<TaxConfig>) => {
    if (editingItem) {
      setTaxList((prev) =>
        prev.map((t) => (t.id === editingItem.id ? { ...t, ...formData } : t))
      )
      toast.success(`Tax configuration "${editingItem.taxId}" updated successfully`)
    } else {
      const currentTaxNumbers = taxList
        .map((t) => {
          const match = t.taxId.match(/\d+/)
          return match ? parseInt(match[0], 10) : 0
        })
        .filter((n) => !isNaN(n))
      const nextNum = (Math.max(0, ...currentTaxNumbers) + 1).toString().padStart(3, '0')
      const newTaxId = `TAX-${nextNum}`

      const newTax: TaxConfig = {
        id: String(Date.now()),
        taxId: newTaxId,
        productCode: formData.productCode || 'PRD-NEW',
        productName: formData.productName || 'New Product Item',
        hsnSac: formData.hsnSac || '8517 12 90',
        taxGroup: formData.taxGroup || 'Standard',
        cgst: formData.cgst ?? 18,
        sgst: formData.sgst ?? 18,
        igst: formData.igst ?? 18,
        cess: formData.cess ?? 0,
        effectiveDate: formData.effectiveDate || '01 Apr 2026',
        isDefault: formData.isDefault ?? false,
      }
      setTaxList((prev) => [...prev, newTax])
      toast.success(`Tax configuration "${newTax.taxId}" created successfully`)
    }
    setDrawerOpen(false)
    setEditingItem(null)
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
        { header: 'CGST Rate', accessor: (t) => `${t.cgst}%` },
        { header: 'SGST Rate', accessor: (t) => `${t.sgst}%` },
        { header: 'IGST Rate', accessor: (t) => `${t.igst}%` },
        { header: 'Tax Group', accessor: (t) => t.taxGroup },
      ],
      'tax-configuration.csv'
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

  // Table Columns matching Figma reference design
  const columns: ColumnsType<TaxConfig> = [
    {
      title: 'Tax ID',
      dataIndex: 'taxId',
      width: 105,
      render: (v: string, record: TaxConfig) => (
        <span
          onClick={() => handleEdit(record)}
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
      width: 220,
      render: (v: string) => (
        <span className="text-xs font-medium text-slate-800">{v}</span>
      ),
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnSac',
      width: 120,
      render: (v: string) => (
        <span className="text-xs text-slate-600 font-mono tracking-wider">{v}</span>
      ),
    },
    {
      title: 'CGST Rate',
      dataIndex: 'cgst',
      width: 95,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v}%</span>
      ),
    },
    {
      title: 'SGST Rate',
      dataIndex: 'sgst',
      width: 95,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v}%</span>
      ),
    },
    {
      title: 'IGST Rate',
      dataIndex: 'igst',
      width: 95,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v}%</span>
      ),
    },
    {
      title: 'Tax Group',
      dataIndex: 'taxGroup',
      width: 130,
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
                onClick: () => handleEdit(record),
              },
              {
                key: 'duplicate',
                icon: <Copy size={14} className="text-slate-600" />,
                label: (
                  <span className="text-xs font-medium text-slate-700">
                    Duplicate
                  </span>
                ),
                onClick: () => handleDuplicate(record),
              },
              {
                key: 'delete',
                icon: <Trash2 size={14} className="text-red-500" />,
                label: (
                  <span className="text-xs font-medium text-red-600">Delete</span>
                ),
                danger: true,
                onClick: () => handleDelete(record),
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

      {/* Header Toolbar matching Figma screenshot */}
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
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingItem(null)
        }}
        initialData={editingItem}
        onSave={handleSaveTax}
      />
    </div>
  )
}