import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { VendorMapping } from '@/types/inventorySetup'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput, DrawerFooter } from '../shared/formControls'
import { PRODUCT_OPTIONS, VENDOR_NAMES } from '@/mocks/inventorySetup.mock'

function CreateVendorMappingDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Create Vendor Mapping</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7A99]">
            Product & Vendor
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Product" required>
            <SelectInput options={PRODUCT_OPTIONS} placeholder="Select Product" />
          </FieldWrap>
          <FieldWrap label="Vendor" required>
            <SelectInput options={VENDOR_NAMES} placeholder="Select Vendor" />
          </FieldWrap>
          <FieldWrap label="Vendor SKU">
            <TextInput placeholder="e.g. SM-A546EZKDINU" />
          </FieldWrap>
          <FieldWrap label="Mapping Type" required>
            <SelectInput options={['Primary', 'Alternate']} placeholder="Select Type" />
          </FieldWrap>
          <FieldWrap label="Lead Time (days)">
            <TextInput type="number" placeholder="e.g. 7" />
          </FieldWrap>
          <FieldWrap label="MOQ">
            <TextInput type="number" placeholder="e.g. 50" />
          </FieldWrap>
        </div>
      </div>

      <DrawerFooter onCancel={onClose} onPrimary={onClose} primaryLabel="Create Mapping" />
    </Modal>
  )
}

export default function VendorMappingTab() {
  const { data: mappings = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-vendor-mappings'],
    queryFn: inventorySetupService.getVendorMappings,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      mappings.filter(
        (m) =>
          m.productName.toLowerCase().includes(search.toLowerCase()) ||
          m.vendorName.toLowerCase().includes(search.toLowerCase())
      ),
    [mappings, search]
  )

  const columns: ColumnsType<VendorMapping> = [
    {
      title: 'Mapping ID',
      dataIndex: 'mappingId',
      width: 110,
      render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
    },
    { title: 'Product', dataIndex: 'productName', width: 200 },
    {
      title: 'Vendor Code',
      dataIndex: 'vendorCode',
      width: 120,
      render: (v: string) => <span className="font-mono text-xs text-[#155DFC]">{v}</span>,
    },
    { title: 'Vendor Name', dataIndex: 'vendorName', width: 200 },
    { title: 'Vendor SKU', dataIndex: 'vendorSku', width: 160 },
    {
      title: 'Lead Time',
      dataIndex: 'leadTimeDays',
      width: 90,
      render: (v: number) => `${v} days`,
    },
    { title: 'MOQ', dataIndex: 'moq', width: 70 },
    {
      title: 'Type',
      dataIndex: 'mappingType',
      width: 110,
      render: (v: VendorMapping['mappingType']) => (
        <ModulePill label={v} variant={v === 'Primary' ? 'blue' : 'purple'} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 95,
      render: (v: VendorMapping['status']) => (
        <ModulePill label={v} variant={v === 'Active' ? 'green' : 'slate'} />
      ),
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
        title="Vendor Mapping"
        count={filtered.length}
        onSearch={setSearch}
        actions={
          <>
            <GhostButton label="Export" />
            <GhostButton label="Import" />
            <PrimaryButton icon={<Plus size={14} />} label="New Mapping" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <ReusableTable columns={columns} data={filtered} loading={isLoading} rowKey="id" />

      <CreateVendorMappingDrawer isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
