import { useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Plus, SlidersHorizontal, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import ReusableTable from '@/components/shared/ReusableTable'
import type { Product } from '@/types/inventorySetup'
import { inventorySetupService } from '@/services/inventorySetupService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import CreateProductDrawer from './CreateProductDrawer'

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleProductCreated = (newProd: Partial<Product>) => {
    queryClient.setQueryData<Product[]>(['inventory-setup-products'], (old = []) => [
      newProd as Product,
      ...old,
    ])
  }

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.productName.toLowerCase().includes(search.toLowerCase()) ||
          p.productCode.toLowerCase().includes(search.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
          (p.group && p.group.toLowerCase().includes(search.toLowerCase()))
      ),
    [products, search]
  )

  const columns: ColumnsType<Product> = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      width: 140,
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
      width: 230,
      render: (_: unknown, r: Product) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 text-xs">{r.productName}</span>
          <span className="text-[11px] text-slate-400 font-mono">{r.prdCode || `PRD-00${r.id}`}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 110,
      render: (_: unknown, r: Product) => (
        <span className="text-xs text-slate-600">{r.department || r.category || r.group}</span>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      width: 110,
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      width: 80,
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      title: 'Cost',
      dataIndex: 'costPrice',
      width: 95,
      render: (v: number) => <span className="text-xs text-slate-700">{formatCompactINR(v)}</span>,
    },
    {
      title: 'RSP',
      dataIndex: 'sellingPrice',
      width: 95,
      render: (v: number) => (
        <span className="text-xs font-bold text-[#155DFC]">{formatCompactINR(v)}</span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      width: 90,
      render: (v: number) => renderStock(v),
    },
    {
      title: 'MRP',
      dataIndex: 'mrp',
      width: 95,
      render: (v: number) => <span className="text-xs text-slate-600">{formatCompactINR(v)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 105,
      render: (v: Product['status']) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {v || 'Active'}
        </span>
      ),
    },
    {
      title: 'Modified',
      dataIndex: 'lastModified',
      width: 110,
      render: (_: unknown, r: Product) => (
        <span className="text-xs text-slate-500 font-mono">{r.modified || r.lastModified || '2025-01-15'}</span>
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
          <GhostButton
            icon={<SlidersHorizontal size={13} className="text-slate-500" />}
            label="Filters"
          />
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
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        }}
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