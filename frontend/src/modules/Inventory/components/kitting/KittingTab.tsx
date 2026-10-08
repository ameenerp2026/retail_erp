import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { Bundle, BundleComponent } from '@/types/inventorySetup'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput, DrawerFooter } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import { formatINR } from '../../utils/format'

function CreateBundleDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [components, setComponents] = useState<BundleComponent[]>([
    { id: 'c1', productName: 'Samsung Galaxy A54', productCode: 'SKU-1091', qty: 1, uom: 'Piece', cost: 28000 },
    { id: 'c2', productName: 'Tempered Glass', productCode: 'SKU-2043', qty: 1, uom: 'Piece', cost: 199 },
    { id: 'c3', productName: 'Silicone Case', productCode: 'SKU-2088', qty: 1, uom: 'Piece', cost: 349 },
  ])

  const total = components.reduce((sum, c) => sum + c.cost * c.qty, 0)

  const addComponent = () =>
    setComponents((prev) => [
      ...prev,
      { id: `c${prev.length + 1}`, productName: '', productCode: '', qty: 1, uom: 'Piece', cost: 0 },
    ])

  const removeComponent = (id: string) =>
    setComponents((prev) => prev.filter((c) => c.id !== id))

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Create Bundle / Kit</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="mb-4">
          <SectionLabel>Bundle Info</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Bundle Name" required>
            <TextInput placeholder="e.g. Galaxy Starter Kit" />
          </FieldWrap>
          <FieldWrap label="Bundle Product" required>
            <div className="flex gap-2">
              <TextInput placeholder="BND-0001" />
              <button
                type="button"
                className="h-10 shrink-0 rounded-lg border border-slate-200 px-4 text-sm font-medium text-[#314158] hover:bg-slate-50"
              >
                Auto
              </button>
            </div>
          </FieldWrap>
          <FieldWrap label="Bundle Type">
            <SelectInput options={['Bundle', 'Kit']} placeholder="Select Type" />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Components</SectionLabel>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
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
                <tr key={c.id} className="border-t border-slate-50">
                  <td className="px-4 py-2.5 text-[#314158]">{c.productName || '—'}</td>
                  <td className="px-3 py-2.5 font-mono text-[#155DFC]">{c.productCode || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-500">{c.qty}</td>
                  <td className="px-3 py-2.5 text-slate-500">{c.uom}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-[#314158]">{formatINR(c.cost)}</td>
                  <td className="pr-3">
                    <button
                      type="button"
                      onClick={() => removeComponent(c.id)}
                      className="text-slate-300 hover:text-rose-500"
                      aria-label="Remove component"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-100 bg-slate-50/50">
                <td className="px-4 py-2.5 font-semibold text-[#314158]" colSpan={4}>
                  Total Bundle Cost
                </td>
                <td className="px-3 py-2.5 text-right font-bold text-[#043793]">{formatINR(total)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addComponent}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#155DFC] hover:underline"
        >
          <Plus size={13} /> Add Product
        </button>
      </div>

      <DrawerFooter onCancel={onClose} onPrimary={onClose} primaryLabel="Save" />
    </Modal>
  )
}

export default function KittingTab() {
  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-bundles'],
    queryFn: inventorySetupService.getBundles,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      bundles.filter(
        (b) =>
          b.bundleName.toLowerCase().includes(search.toLowerCase()) ||
          b.bundleCode.toLowerCase().includes(search.toLowerCase())
      ),
    [bundles, search]
  )

  const columns: ColumnsType<Bundle> = [
    {
      title: '',
      key: 'select',
      width: 40,
      render: () => <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />,
    },
    {
      title: 'Bundle Code',
      dataIndex: 'bundleCode',
      width: 140,
      render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
    },
    { title: 'Bundle Name', dataIndex: 'bundleName', width: 210 },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 110,
      render: (v: Bundle['type']) => <ModulePill label={v} variant={v === 'Bundle' ? 'blue' : 'purple'} />,
    },
    {
      title: 'Components',
      dataIndex: 'components',
      width: 110,
      render: (v: BundleComponent[]) => `${v.length} items`,
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      width: 120,
      render: (v: number) => <span className="font-semibold text-[#314158]">{formatINR(v)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 95,
      render: (v: Bundle['status']) => <ModulePill label={v} variant="green" />,
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

  return (
    <div>
      <TabToolbar
        title="Kitting & Bundling"
        count={filtered.length}
        onSearch={setSearch}
        actions={
          <>
            <GhostButton label="Filters" />
            <PrimaryButton icon={<Plus size={14} />} label="Create Bundle" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <ReusableTable columns={columns} data={filtered} loading={isLoading} rowKey="id" />

      <CreateBundleDrawer isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
