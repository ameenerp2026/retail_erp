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
import type { Bundle, BundleComponent } from '@/types/inventorySetup'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput, DrawerFooter } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import toast from 'react-hot-toast'
import { exportToCSV } from '@/utils/exportData'

// Deterministic code generator (module-scope counter) — replaces the impure
// `Math.random()` fallback that is not allowed during render.
let bundleCodeCounter = 0
const nextBundleCode = () => `BND-NEW-${100 + (bundleCodeCounter++ % 900)}`

// Currency formatter matching Figma: e.g. ₹51.2K, ₹8.9K, ₹780, ₹63.0K
const formatKPrice = (amount?: number) => {
  if (amount === undefined || amount === null) return '—'
  if (amount >= 1000) {
    const kVal = (amount / 1000).toFixed(1)
    return `₹${kVal}K`
  }
  return `₹${amount}`
}

function BundleDrawer({
  isOpen,
  onClose,
  initialData,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  initialData?: Bundle | null
  onSave: (bundle: Partial<Bundle>) => void
}) {
  const [bundleName, setBundleName] = useState(initialData?.bundleName || '')
  const [bundleCode, setBundleCode] = useState(initialData?.bundleCode || '')
  const [bundleType, setBundleType] = useState<string>(initialData?.type || 'Bundle')
  const [sellPrice, setSellPrice] = useState<number>(initialData?.sellPrice || 0)
  const [components, setComponents] = useState<BundleComponent[]>(
    initialData?.components || [
      { id: 'c1', productName: 'Samsung Galaxy A54', productCode: 'SKU-1091', qty: 1, uom: 'Piece', cost: 48000 },
      { id: 'c2', productName: 'Tempered Glass', productCode: 'SKU-2043', qty: 1, uom: 'Piece', cost: 1200 },
      { id: 'c3', productName: 'Silicone Case', productCode: 'SKU-2088', qty: 1, uom: 'Piece', cost: 2000 },
    ]
  )

  // Sync state if initialData changes
  const prevIdRef = useRef(initialData?.id)
  if (initialData?.id !== prevIdRef.current) {
    prevIdRef.current = initialData?.id
    setBundleName(initialData?.bundleName || '')
    setBundleCode(initialData?.bundleCode || '')
    setBundleType(initialData?.type || 'Bundle')
    setSellPrice(initialData?.sellPrice || 0)
    setComponents(
      initialData?.components || [
        { id: 'c1', productName: 'Samsung Galaxy A54', productCode: 'SKU-1091', qty: 1, uom: 'Piece', cost: 48000 },
        { id: 'c2', productName: 'Tempered Glass', productCode: 'SKU-2043', qty: 1, uom: 'Piece', cost: 1200 },
        { id: 'c3', productName: 'Silicone Case', productCode: 'SKU-2088', qty: 1, uom: 'Piece', cost: 2000 },
      ]
    )
  }

  const totalCost = components.reduce((sum, c) => sum + c.cost * c.qty, 0)

  const addComponent = () =>
    setComponents((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        productName: 'New Accessory Item',
        productCode: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        qty: 1,
        uom: 'Piece',
        cost: 500,
      },
    ])

  const removeComponent = (id: string) =>
    setComponents((prev) => prev.filter((c) => c.id !== id))

  const handleSubmit = () => {
    if (!bundleName.trim()) {
      toast.error('Please enter a Bundle Name')
      return
    }

    onSave({
      bundleName: bundleName.trim(),
      bundleCode: bundleCode || nextBundleCode(),
      type: (bundleType as 'Bundle' | 'Kit') || 'Bundle',
      components,
      totalCost,
      sellPrice: sellPrice > 0 ? sellPrice : Math.round(totalCost * 1.25),
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">
          {initialData ? `Edit Bundle (${initialData.bundleCode})` : 'Create Bundle / Kit'}
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
          <SectionLabel>Bundle Info</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Bundle Name" required>
            <TextInput
              value={bundleName}
              onChange={(v) => setBundleName(v)}
              placeholder="e.g. Galaxy Starter Kit"
            />
          </FieldWrap>
          <FieldWrap label="Bundle Code" required>
            <div className="flex gap-2">
              <TextInput
                value={bundleCode}
                onChange={(v) => setBundleCode(v)}
                placeholder="BND-0001"
              />
              <button
                type="button"
                onClick={() =>
                  setBundleCode(`BND-${Math.floor(1000 + Math.random() * 9000)}`)
                }
                className="h-10 shrink-0 rounded-lg border border-slate-200 px-3.5 text-xs font-medium text-[#314158] hover:bg-slate-50 cursor-pointer"
              >
                Auto
              </button>
            </div>
          </FieldWrap>
          <FieldWrap label="Bundle Type">
            <SelectInput
              options={['Bundle', 'Kit']}
              value={bundleType}
              onChange={(v) => setBundleType(v)}
              placeholder="Select Type"
            />
          </FieldWrap>
          <FieldWrap label="Sell Price (₹)">
            <TextInput
              type="number"
              value={sellPrice}
              onChange={(v) => setSellPrice(Number(v))}
              placeholder="e.g. 63000"
            />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Components ({components.length})</SectionLabel>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Product</th>
                <th className="px-3 py-2.5 font-semibold">Product Code</th>
                <th className="px-3 py-2.5 font-semibold">Qty</th>
                <th className="px-3 py-2.5 font-semibold">UOM</th>
                <th className="px-3 py-2.5 text-right font-semibold">Cost</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {components.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-800">{c.productName || '—'}</td>
                  <td className="px-3 py-2.5 font-mono text-[#155DFC]">{c.productCode || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-500">{c.qty}</td>
                  <td className="px-3 py-2.5 text-slate-500">{c.uom}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-slate-700">
                    ₹{c.cost.toLocaleString('en-IN')}
                  </td>
                  <td className="pr-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeComponent(c.id)}
                      className="text-slate-300 hover:text-rose-500 transition cursor-pointer"
                      aria-label="Remove component"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50/70">
                <td className="px-4 py-2.5 font-semibold text-slate-700" colSpan={4}>
                  Total Bundle Cost
                </td>
                <td className="px-3 py-2.5 text-right font-bold text-[#0F2A66]">
                  ₹{totalCost.toLocaleString('en-IN')}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addComponent}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#155DFC] hover:underline cursor-pointer"
        >
          <Plus size={13} /> Add Product
        </button>
      </div>

      <DrawerFooter
        onCancel={onClose}
        onPrimary={handleSubmit}
        primaryLabel={initialData ? 'Update' : 'Save'}
      />
    </Modal>
  )
}

export default function KittingTab() {
  const { data: initialBundles = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-bundles'],
    queryFn: inventorySetupService.getBundles,
  })

  const [bundleList, setBundleList] = useState<Bundle[]>([])
  const [initialized, setInitialized] = useState(false)

  // Drawer states
  const [createOpen, setCreateOpen] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Bundle' | 'Kit'>('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Table row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync initial query
  if (!initialized && initialBundles.length > 0) {
    setBundleList(initialBundles)
    setInitialized(true)
  }

  // Duplicate handler
  const handleDuplicate = (record: Bundle) => {
    // Determine next sequential bundle code
    const isKit = record.bundleCode.startsWith('KIT-')
    const prefix = isKit ? 'KIT' : 'BND'
    const newCode = `${prefix}-CPY-${String(bundleList.length + 1).padStart(3, '0')}`

    const duplicatedItem: Bundle = {
      ...record,
      id: String(Date.now()),
      bundleCode: newCode,
      bundleName: `${record.bundleName} (Copy)`,
      components: [...record.components],
    }

    const targetIndex = bundleList.findIndex((b) => b.id === record.id)
    if (targetIndex >= 0) {
      const updated = [...bundleList]
      updated.splice(targetIndex + 1, 0, duplicatedItem)
      setBundleList(updated)
    } else {
      setBundleList((prev) => [...prev, duplicatedItem])
    }

    toast.success(`Bundle "${record.bundleCode}" duplicated as "${newCode}"`)
  }

  // Edit handler
  const handleEdit = (record: Bundle) => {
    setEditingBundle(record)
    setCreateOpen(true)
  }

  // Delete handler
  const handleDelete = (record: Bundle) => {
    setBundleList((prev) => prev.filter((b) => b.id !== record.id))
    toast.success(`Bundle "${record.bundleCode}" deleted`)
  }

  // Save (Create or Update) handler
  const handleSaveBundle = (formData: Partial<Bundle>) => {
    if (editingBundle) {
      setBundleList((prev) =>
        prev.map((b) => (b.id === editingBundle.id ? { ...b, ...formData } : b))
      )
      toast.success(`Bundle "${editingBundle.bundleCode}" updated successfully`)
    } else {
      const newBundle: Bundle = {
        id: String(Date.now()),
        bundleCode: formData.bundleCode || `BND-${String(bundleList.length + 1).padStart(3, '0')}`,
        bundleName: formData.bundleName || 'New Bundle',
        bundleProductCode: `BND-PRD-${String(bundleList.length + 1).padStart(4, '0')}`,
        type: formData.type || 'Bundle',
        components: formData.components || [],
        totalCost: formData.totalCost || 0,
        sellPrice: formData.sellPrice || 0,
        status: 'Active',
      }
      setBundleList((prev) => [...prev, newBundle])
      toast.success(`Bundle "${newBundle.bundleCode}" created successfully`)
    }
    setCreateOpen(false)
    setEditingBundle(null)
  }

  // Export handler
  const handleExport = () => {
    exportToCSV(
      bundleList,
      [
        { header: 'Bundle Code', accessor: (b) => b.bundleCode },
        { header: 'Bundle Name', accessor: (b) => b.bundleName },
        { header: 'Components Count', accessor: (b) => b.components?.length ?? 0 },
        { header: 'Total Cost', accessor: (b) => formatKPrice(b.totalCost) },
        { header: 'Sell Price', accessor: (b) => formatKPrice(b.sellPrice) },
      ],
      'kitting-and-bundles.csv'
    )
    toast.success('Kitting and bundle data exported to CSV')
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

  // Filter logic
  const filtered = useMemo(() => {
    return bundleList.filter((b) => {
      const q = search.toLowerCase()
      const matchesSearch =
        b.bundleName.toLowerCase().includes(q) ||
        b.bundleCode.toLowerCase().includes(q)
      const matchesType = typeFilter === 'All' || b.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [bundleList, search, typeFilter])

  // Table Columns matching Figma reference screenshot
  const columns: ColumnsType<Bundle> = [
    {
      title: 'Bundle Code',
      dataIndex: 'bundleCode',
      width: 160,
      render: (v: string, record: Bundle) => (
        <span
          onClick={() => handleEdit(record)}
          className="font-medium text-xs text-[#155DFC] hover:underline cursor-pointer"
        >
          {v}
        </span>
      ),
    },
    {
      title: 'Bundle Name',
      dataIndex: 'bundleName',
      width: 250,
      render: (v: string) => (
        <span className="text-xs font-medium text-slate-800">{v}</span>
      ),
    },
    {
      title: 'Components',
      dataIndex: 'components',
      width: 120,
      align: 'center',
      render: (v: BundleComponent[]) => (
        <span className="text-xs font-normal text-slate-700">{v?.length ?? 0}</span>
      ),
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      width: 140,
      align: 'right',
      render: (v: number) => (
        <span className="text-xs font-medium text-slate-600">{formatKPrice(v)}</span>
      ),
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      width: 140,
      align: 'right',
      render: (v: number, record: Bundle) => (
        <span className="text-xs font-semibold text-[#155DFC]">
          {formatKPrice(v || record.totalCost * 1.25)}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_: unknown, record: Bundle) => (
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
              Kitting &amp; Bundling
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
                typeFilter !== 'All'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ListFilter size={13} className="text-slate-500" />
              <span>Filters</span>
              {typeFilter !== 'All' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                  {typeFilter}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute left-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                {(['All', 'Bundle', 'Kit'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTypeFilter(t)
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      typeFilter === t
                        ? 'font-semibold text-blue-600 bg-blue-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{t}</span>
                    {typeFilter === t && <Check size={12} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Export, Import & + New Bundle */}
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
              setEditingBundle(null)
              setCreateOpen(true)
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#155DFC] hover:bg-blue-600 rounded-lg transition shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            <Plus size={14} />
            <span>New Bundle</span>
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
      <BundleDrawer
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setEditingBundle(null)
        }}
        initialData={editingBundle}
        onSave={handleSaveBundle}
      />
    </div>
  )
}