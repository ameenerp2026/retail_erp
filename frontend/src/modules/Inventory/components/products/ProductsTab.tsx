import { useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Dropdown } from 'antd'
import { MoreHorizontal, Plus } from 'lucide-react'
import ReusableTable from '@/components/shared/ReusableTable'
import type { Product } from '@/types/inventorySetup'
import { inventorySetupService } from '@/services/inventorySetupService'
import { useQuery } from '@tanstack/react-query'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import CreateProductDrawer from './CreateProductDrawer'
import { formatINR } from '../../utils/format'

const columns: ColumnsType<Product> = [
  {
    title: 'Product Code',
    dataIndex: 'productCode',
    width: 140,
    render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
  },
  { title: 'Product Name', dataIndex: 'productName', width: 220 },
  { title: 'Department', dataIndex: 'department', width: 120 },
  { title: 'Section', dataIndex: 'section', width: 130 },
  { title: 'Category', dataIndex: 'category', width: 130 },
  { title: 'Brand', dataIndex: 'brand', width: 110 },
  { title: 'UOM', dataIndex: 'uom', width: 90 },
  {
    title: 'Cost Price',
    dataIndex: 'costPrice',
    width: 110,
    render: (v: number) => formatINR(v),
  },
  {
    title: 'MRP',
    dataIndex: 'mrp',
    width: 100,
    render: (v: number) => formatINR(v),
  },
  {
    title: 'Selling Price',
    dataIndex: 'sellingPrice',
    width: 120,
    render: (v: number) => formatINR(v),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
    render: (v: Product['status']) => <ModulePill label={v} variant={v === 'Active' ? 'green' : 'slate'} />,
  },
  {
    title: '',
    key: 'actions',
    width: 50,
    render: () => (
      <Dropdown
        menu={{
          items: [
            { key: 'edit', label: 'Edit' },
            { key: 'duplicate', label: 'Duplicate' },
            { type: 'divider' as const },
            { key: 'delete', label: 'Delete', danger: true },
          ],
        }}
        trigger={['click']}
      >
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
          <MoreHorizontal size={16} />
        </button>
      </Dropdown>
    ),
  },
]

export default function ProductsTab() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-products'],
    queryFn: inventorySetupService.getProducts,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.productName.toLowerCase().includes(search.toLowerCase()) ||
          p.productCode.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  )

  return (
    <div>
      <TabToolbar
        title="Products"
        count={filtered.length}
        onSearch={setSearch}
        actions={
          <>
            <GhostButton label="Export" />
            <GhostButton label="Import" />
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
        isOpen={createOpen || !!selected}
        onClose={() => {
          setCreateOpen(false)
          setSelected(null)
        }}
        product={selected}
      />
    </div>
  )
}
