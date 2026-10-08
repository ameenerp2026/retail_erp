import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { TaxConfig } from '@/types/inventorySetup'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput, Toggle, DrawerFooter } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import { TAX_GROUPS } from '@/mocks/inventorySetup.mock'

function CreateTaxDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Create Tax Configuration</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="mb-4">
          <SectionLabel>Tax Identity</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Tax ID">
            <TextInput placeholder="Tax ID is Auto-generated" disabled />
          </FieldWrap>
          <FieldWrap label="Tax Group" required>
            <SelectInput options={TAX_GROUPS} placeholder="Select dropdown" />
          </FieldWrap>
          <FieldWrap label="HSN/SAC Code">
            <TextInput placeholder="e.g. 8471" />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Tax Rates</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="CGST %"><TextInput type="number" placeholder="0" /></FieldWrap>
          <FieldWrap label="SGST %"><TextInput type="number" placeholder="0" /></FieldWrap>
          <FieldWrap label="IGST %"><TextInput type="number" placeholder="0" /></FieldWrap>
          <FieldWrap label="CESS %"><TextInput type="number" placeholder="0" /></FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Settings</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Effective Date">
            <TextInput type="date" />
          </FieldWrap>
          <div className="flex items-end justify-between gap-3 pb-1">
            <span className="text-xs font-medium text-[#314158]">Default Tax</span>
            <Toggle checked={false} />
          </div>
        </div>
      </div>

      <DrawerFooter onCancel={onClose} onPrimary={onClose} primaryLabel="Save" />
    </Modal>
  )
}

export default function TaxTab() {
  const { data: taxes = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-tax'],
    queryFn: inventorySetupService.getTaxConfigs,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      taxes.filter(
        (t) =>
          t.productName.toLowerCase().includes(search.toLowerCase()) ||
          t.productCode.toLowerCase().includes(search.toLowerCase()) ||
          t.taxId.toLowerCase().includes(search.toLowerCase())
      ),
    [taxes, search]
  )

  const columns: ColumnsType<TaxConfig> = [
    {
      title: '',
      key: 'select',
      width: 40,
      render: () => <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />,
    },
    {
      title: 'Tax ID',
      dataIndex: 'taxId',
      width: 100,
      render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      width: 140,
      render: (v: string) => <span className="font-mono text-xs text-[#155DFC]">{v}</span>,
    },
    { title: 'Product Name', dataIndex: 'productName', width: 200 },
    { title: 'HSN/SAC', dataIndex: 'hsnSac', width: 90 },
    { title: 'Tax Group', dataIndex: 'taxGroup', width: 140 },
    { title: 'CGST %', dataIndex: 'cgst', width: 80 },
    { title: 'SGST %', dataIndex: 'sgst', width: 80 },
    { title: 'IGST %', dataIndex: 'igst', width: 80 },
    { title: 'CESS %', dataIndex: 'cess', width: 80 },
    { title: 'Effective Date', dataIndex: 'effectiveDate', width: 120 },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      width: 90,
      render: (v: boolean) => (v ? <ModulePill label="Default" variant="blue" /> : <span className="text-xs text-slate-300">—</span>),
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
        title="Tax Configuration"
        count={filtered.length}
        onSearch={setSearch}
        actions={
          <>
            <GhostButton label="Filters" />
            <PrimaryButton icon={<Plus size={14} />} label="New Tax Config" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <ReusableTable columns={columns} data={filtered} loading={isLoading} rowKey="id" />

      <CreateTaxDrawer isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
