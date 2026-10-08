import { useMemo, useState } from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { AttributeColumn, ProductAttributeRow } from '@/types/inventorySetup'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, TextInput, DrawerFooter } from '../shared/formControls'

function EditAttributesModal({
  isOpen,
  onClose,
  row,
}: {
  isOpen: boolean
  onClose: () => void
  row: ProductAttributeRow | null
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#043793]">Edit Product Attributes</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {row ? `${row.productName} · ${row.productCode}` : ''}
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>
      <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FieldWrap label="Color"><TextInput placeholder="e.g. Black" /></FieldWrap>
          <FieldWrap label="Size"><TextInput placeholder="e.g. M" /></FieldWrap>
          <FieldWrap label="Material"><TextInput placeholder="e.g. Cotton" /></FieldWrap>
          <FieldWrap label="Unit"><TextInput placeholder="e.g. Piece" /></FieldWrap>
          <FieldWrap label="Weight"><TextInput placeholder="e.g. 250g" /></FieldWrap>
          <FieldWrap label="Fit"><TextInput placeholder="e.g. Slim" /></FieldWrap>
          <FieldWrap label="Fabric"><TextInput placeholder="e.g. Blend" /></FieldWrap>
          <FieldWrap label="Variant"><TextInput placeholder="e.g. Standard" /></FieldWrap>
        </div>
      </div>
      <DrawerFooter onCancel={onClose} onPrimary={onClose} />
    </Modal>
  )
}

function AddAttributeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Add Attribute</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>
      <div className="px-6 py-5">
        <FieldWrap label="Attribute Name" required>
          <TextInput placeholder="e.g. Sleeve Length" />
        </FieldWrap>
        <div className="mt-4">
          <FieldWrap label="Values (comma separated)">
            <TextInput placeholder="e.g. Short, Half, Full" />
          </FieldWrap>
        </div>
      </div>
      <DrawerFooter onCancel={onClose} onPrimary={onClose} />
    </Modal>
  )
}

export default function AttributesTab() {
  const { data: columnsData = [] } = useQuery({
    queryKey: ['inventory-setup-attr-cols'],
    queryFn: inventorySetupService.getAttributeColumns,
  })
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-attr-rows'],
    queryFn: inventorySetupService.getAttributeRows,
  })

  const [editRow, setEditRow] = useState<ProductAttributeRow | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const attrColumns = useMemo<ColumnsType<ProductAttributeRow>>(() => {
    const cols: ColumnsType<ProductAttributeRow> = [
      {
        title: 'Product Code',
        dataIndex: 'productCode',
        width: 130,
        render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
      },
      { title: 'Product Name', dataIndex: 'productName', width: 190 },
    ]

    for (const col of columnsData as AttributeColumn[]) {
      cols.push({
        title: col.name,
        key: col.id,
        width: 100,
        render: (_: unknown, record: ProductAttributeRow) => record.attributes[col.name] ?? '—',
      })
    }

    cols.push({
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', label: 'Edit Attributes', icon: <Pencil size={13} />, onClick: () => setEditRow(record) },
              { key: 'delete', label: 'Delete', danger: true, icon: <Trash2 size={13} /> },
            ],
          }}
          trigger={['click']}
        >
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      ),
    })

    return cols
  }, [columnsData])

  return (
    <div>
      <TabToolbar
        title="Attributes"
        count={rows.length}
        actions={
          <>
            <GhostButton label="Export" />
            <GhostButton label="Import" />
            <PrimaryButton icon={<Plus size={14} />} label="Add Attribute" onClick={() => setAddOpen(true)} />
          </>
        }
      />

      {/* Column adders — design shows + Pills per attribute column */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(columnsData as AttributeColumn[]).map((col) => (
          <button
            key={col.id}
            type="button"
            className="flex h-7 items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 text-[11px] font-medium text-slate-500 transition hover:border-[#155DFC] hover:text-[#155DFC]"
          >
            <Plus size={11} /> {col.name}
          </button>
        ))}
      </div>

      <ReusableTable columns={attrColumns} data={rows} loading={isLoading} rowKey="id" />

      <EditAttributesModal isOpen={!!editRow} onClose={() => setEditRow(null)} row={editRow} />
      <AddAttributeModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
