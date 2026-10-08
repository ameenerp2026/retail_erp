import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { PriceRule } from '@/types/inventorySetup'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput, DrawerFooter } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import { formatINR } from '../../utils/format'
import { PRICE_RULE_TYPES, ROUNDING_OPTIONS } from '@/mocks/inventorySetup.mock'

function CreatePriceRuleDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Create Price Rule</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="mb-5">
          <SectionLabel>Rule Basis</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Product" required>
            <SelectInput
              options={['Samsung Galaxy A54 5G', 'Nike Air Max 270', 'Dove Body Wash 500ml']}
              placeholder="Select Product"
            />
          </FieldWrap>
          <FieldWrap label="Rule Type" required>
            <SelectInput options={PRICE_RULE_TYPES} placeholder="Select Rule Type" />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-5">
          <SectionLabel>Pricing Calculation</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FieldWrap label="Base Price" required>
            <TextInput type="number" placeholder="e.g. 28000" />
          </FieldWrap>
          <FieldWrap label="WSP %">
            <TextInput type="number" placeholder="e.g. 12" />
          </FieldWrap>
          <FieldWrap label="RSP %">
            <TextInput type="number" placeholder="e.g. 39" />
          </FieldWrap>
          <FieldWrap label="Rounding">
            <SelectInput options={ROUNDING_OPTIONS} placeholder="Select Rounding" />
          </FieldWrap>
          <FieldWrap label="Effective Date" required>
            <TextInput type="date" />
          </FieldWrap>
          <FieldWrap label="Status">
            <SelectInput options={['Active', 'Inactive']} placeholder="Select Status" />
          </FieldWrap>
        </div>
      </div>

      <DrawerFooter onCancel={onClose} onPrimary={onClose} primaryLabel="Create Rule" />
    </Modal>
  )
}

export default function PricingTab() {
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-price-rules'],
    queryFn: inventorySetupService.getPriceRules,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      rules.filter(
        (r) =>
          r.productName.toLowerCase().includes(search.toLowerCase()) ||
          r.productCode.toLowerCase().includes(search.toLowerCase()) ||
          r.priceId.toLowerCase().includes(search.toLowerCase())
      ),
    [rules, search]
  )

  const columns: ColumnsType<PriceRule> = [
    {
      title: 'Price ID',
      dataIndex: 'priceId',
      width: 110,
      render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      width: 140,
      render: (v: string) => <span className="font-mono text-xs text-[#155DFC]">{v}</span>,
    },
    { title: 'Product Name', dataIndex: 'productName', width: 200 },
    { title: 'Cost Price', dataIndex: 'costPrice', width: 110, render: (v: number) => formatINR(v) },
    { title: 'WSP', dataIndex: 'wsp', width: 100, render: (v: number) => formatINR(v) },
    { title: 'RSP', dataIndex: 'rsp', width: 100, render: (v: number) => formatINR(v) },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      width: 120,
      render: (v: number) => <span className="font-semibold text-[#314158]">{formatINR(v)}</span>,
    },
    { title: 'Effective Date', dataIndex: 'effectiveDate', width: 120 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (v: PriceRule['status']) => (
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
        title="Pricing (Price Master)"
        count={filtered.length}
        onSearch={setSearch}
        actions={
          <>
            <GhostButton label="Export" />
            <GhostButton label="Import" />
            <PrimaryButton icon={<Plus size={14} />} label="New Price" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <ReusableTable columns={columns} data={filtered} loading={isLoading} rowKey="id" />

      <CreatePriceRuleDrawer isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
