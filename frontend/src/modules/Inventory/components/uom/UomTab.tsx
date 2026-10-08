import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { Uom } from '@/types/inventorySetup'
import TabToolbar, { PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, TextInput, DrawerFooter } from '../shared/formControls'
import { Plus, Trash2 } from 'lucide-react'

function UomList({
  items,
  emptyLabel,
  onRemove,
}: {
  items: Uom[]
  emptyLabel: string
  onRemove?: (id: string) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="grid grid-cols-[1fr_110px] items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7A99]">UOM Name</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7A99]">Status</span>
      </div>
      <div className="max-h-[420px] min-h-[200px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-slate-400">{emptyLabel}</div>
        ) : (
          items.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_110px] items-center gap-2 border-b border-slate-50 px-4 py-2.5 last:border-b-0"
            >
              <span className="text-sm text-[#314158]">{u.name}</span>
              <ModulePill label={u.status} variant="green" />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(u.id)}
                  className="text-slate-300 transition hover:text-rose-500"
                  aria-label="Remove"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function CreateUomDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Create UOM</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>
      <div className="px-6 py-5">
        <FieldWrap label="UOM Name" required>
          <TextInput placeholder="e.g. Kilogram" />
        </FieldWrap>
      </div>
      <DrawerFooter onCancel={onClose} onPrimary={onClose} />
    </Modal>
  )
}

export default function UomTab() {
  const { data: uoms = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-uoms'],
    queryFn: inventorySetupService.getUoms,
  })

  const [left, setLeft] = useState<Uom[]>([])
  const [right, setRight] = useState<Uom[]>([])
  const [initialized, setInitialized] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  // Split list into two panes on first load (design shows two identical columns)
  if (!initialized && uoms.length > 0) {
    const mid = Math.ceil(uoms.length / 2)
    setLeft(uoms.slice(0, mid))
    setRight(uoms.slice(mid))
    setInitialized(true)
  }

  const removeFrom = (list: Uom[], setList: (v: Uom[]) => void, id: string) =>
    setList(list.filter((u) => u.id !== id))

  return (
    <div>
      <TabToolbar
        title="Units of Measure"
        count={uoms.length}
        actions={
          <PrimaryButton icon={<Plus size={14} />} label="Create UOM" onClick={() => setCreateOpen(true)} />
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-50" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UomList
            items={left}
            emptyLabel="No UOMs — create one to get started"
            onRemove={(id) => removeFrom(left, setLeft, id)}
          />
          <UomList
            items={right}
            emptyLabel="No UOMs — create one to get started"
            onRemove={(id) => removeFrom(right, setRight, id)}
          />
        </div>
      )}

      <CreateUomDrawer isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
