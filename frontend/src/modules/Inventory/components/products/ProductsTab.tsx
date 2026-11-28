import { useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Plus, SlidersHorizontal, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Popover, Select } from 'antd'
import ReusableTable from '@/components/shared/ReusableTable'
import type { Product } from '@/types/inventorySetup'
import { inventorySetupService } from '@/services/inventorySetupService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import CreateProductDrawer from './CreateProductDrawer'

const toFilterOptions = (values: Array<string | undefined>) =>
  [...new Set(values.flatMap((value) => (value?.trim() ? [value.trim()] : [])))]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ label: value, value }))

function formatCompactINR(val: number | string | undefined): string {
  if (val === undefined || val === null) return '-'
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return String(val)
  if (num >= 1000) {
    const k = (num / 1000).toFixed(1)
    return `₹${k}K`
  }
  return `₹${num.toLocaleString('en-IN')}`
}

function renderStock(stock: number | undefined) {
  if (stock === undefined || stock === null) return '-'
  if (stock === 0) {
    return <span className="font-bold text-red-600">0</span>
  }
  if (stock < 10) {
    return <span className="font-bold text-amber-600">{stock}</span>
  }
  return <span className="font-semibold text-[#155DFC]">{stock.toLocaleString('en-IN')}</span>
}

export default function ProductsTab() {
  const queryClient = useQueryClient()
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-products'],
    queryFn: inventorySetupService.getProducts,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState<string | undefined>()
  const [brandFilter, setBrandFilter] = useState<string | undefined>()
  const [uomFilter, setUomFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const handleProductCreated = (newProd: Partial<Product>) => {
    queryClient.setQueryData<Product[]>(['inventory-setup-products'], (old = []) => [
      newProd as Product,
      ...old,
    ])
  }

  const groupOptions = useMemo(() => toFilterOptions(products.map((p) => p.group)), [products])
  const brandOptions = useMemo(() => toFilterOptions(products.map((p) => p.brand)), [products])
  const uomOptions = useMemo(() => toFilterOptions(products.map((p) => p.uom)), [products])
  const activeFilterCount = [groupFilter, brandFilter, uomFilter, statusFilter].filter(
    Boolean,
  ).length

  const filtered = useMemo(() => {
    const searchTerm = search.toLowerCase()
    return products.filter((p) => {
      const matchesSearch =
        p.productName.toLowerCase().includes(searchTerm) ||
        p.productCode.toLowerCase().includes(searchTerm) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
        (p.group && p.group.toLowerCase().includes(searchTerm))

      return (
        matchesSearch &&
        (!groupFilter || p.group?.trim() === groupFilter) &&
        (!brandFilter || p.brand.trim() === brandFilter) &&
        (!uomFilter || p.uom.trim() === uomFilter) &&
        (!statusFilter ||
          String(p.status).toLowerCase() === statusFilter.toLowerCase())
      )
    })
  }, [products, search, groupFilter, brandFilter, uomFilter, statusFilter])

  const clearFilters = () => {
    setGroupFilter(undefined)
    setBrandFilter(undefined)
    setUomFilter(undefined)
    setStatusFilter(undefined)
  }

  const filterContent = (
    <div className="w-56 space-y-3">
      <label className="block text-xs">
        <span className="mb-1 block">Group</span>
        <Select<string>
          size="small"
          allowClear
          placeholder="All"
          value={groupFilter}
          options={groupOptions}
          onChange={setGroupFilter}
          style={{ width: '100%' }}
        />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block">Brand</span>
        <Select<string>
          size="small"
          allowClear
          placeholder="All"
          value={brandFilter}
          options={brandOptions}
          onChange={setBrandFilter}
          style={{ width: '100%' }}
        />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block">UOM</span>
        <Select<string>
          size="small"
          allowClear
          placeholder="All"
          value={uomFilter}
          options={uomOptions}
          onChange={setUomFilter}
          style={{ width: '100%' }}
        />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block">Status</span>
        <Select<string>
          size="small"
          allowClear
          placeholder="All"
          value={statusFilter}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
          onChange={setStatusFilter}
          style={{ width: '100%' }}
        />
      </label>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-[#155DFC] hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  const columns: ColumnsType<Product> = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      width: 120,
      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
      render: (v: string, record: Product) => (
        <button
          type="button"
          onClick={() => setSelected(record)}
          className="font-mono text-xs font-semibold text-[#155DFC] hover:underline text-left cursor-pointer"
        >
          {v}
        </button>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      width: 180,
      render: (_: unknown, r: Product) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 text-xs">{r.productName}</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {r.prdCode || `PRD-${String(r.id).padStart(3, '0')}`}
          </span>
        </div>
      ),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      width: 95,
      render: (_: unknown, r: Product) => (
        <span className="text-xs text-slate-600">{r.group || '-'}</span>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      width: 85,
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      width: 55,
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      title: 'Cost',
      dataIndex: 'costPrice',
      width: 70,
      render: (v: number) => <span className="text-xs text-slate-700">{formatCompactINR(v)}</span>,
    },
    {
      title: 'RSP',
      dataIndex: 'sellingPrice',
      width: 70,
      render: (v: number) => (
        <span className="text-xs font-bold text-[#155DFC]">{formatCompactINR(v)}</span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      width: 65,
      render: (v: number) => renderStock(v),
    },
    {
      title: 'MRP',
      dataIndex: 'mrp',
      width: 75,
      render: (v: number) => <span className="text-xs text-slate-600">{formatCompactINR(v)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 90,
      render: (v: Product['status']) => {
        const isActive = String(v).toLowerCase() === 'active'
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
              isActive
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      },
    },
    {
      title: 'Modified',
      dataIndex: 'lastModified',
      width: 95,
      render: (_: unknown, r: Product) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
          {r.modified || r.lastModified || '-'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <TabToolbar
        title="Products"
        count={filtered.length}
        onSearch={setSearch}
        filters={
          <Popover content={filterContent} trigger="click" placement="bottomLeft">
            <span className="inline-flex">
              <GhostButton
                icon={<SlidersHorizontal size={13} className="text-slate-500" />}
                label={activeFilterCount ? `Filters (${activeFilterCount})` : 'Filters'}
              />
            </span>
          </Popover>
        }
        actions={
          <>
            <GhostButton
              icon={<ArrowUpRight size={13} className="text-slate-500" />}
              label="Export"
            />
            <GhostButton
              icon={<ArrowDownLeft size={13} className="text-slate-500" />}
              label="Import"
            />
            <PrimaryButton
              icon={<Plus size={14} />}
              label="New Product"
              onClick={() => setCreateOpen(true)}
            />
          </>
        }
      />

      <ReusableTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        rowKey="id"
        onRowClick={(product) => setSelected(product)}
      />

      <CreateProductDrawer
        key={`${selected?.id ?? 'new'}-open`}
        isOpen={createOpen || !!selected}
        onClose={() => {
          setCreateOpen(false)
          setSelected(null)
        }}
        product={selected}
        onProductCreated={handleProductCreated}
      />
    </div>
  )
}