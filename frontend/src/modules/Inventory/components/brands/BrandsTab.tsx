import { useMemo, useState } from 'react'
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Dropdown } from 'antd'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { Brand } from '@/types/inventorySetup'
import TabToolbar, { PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { FieldWrap, TextInput, DrawerFooter } from '../shared/formControls'

function CreateBrandDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">Create Brand</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Brand Name" required>
            <TextInput placeholder="e.g. Samsung" />
          </FieldWrap>
          <FieldWrap label="Brand Code">
            <div className="flex gap-2">
              <TextInput placeholder="Auto-generated" disabled />
              <button
                type="button"
                className="h-10 shrink-0 rounded-lg border border-slate-200 px-4 text-sm font-medium text-[#314158] hover:bg-slate-50"
              >
                Auto
              </button>
            </div>
          </FieldWrap>
        </div>
        <div className="mt-4">
          <FieldWrap label="Description">
            <textarea
              rows={3}
              placeholder="Short brand description..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#314158] placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20"
            />
          </FieldWrap>
        </div>
      </div>
      <DrawerFooter onCancel={onClose} onPrimary={onClose} />
    </Modal>
  )
}

function BrandCard({
  brand,
  onDelete,
}: {
  brand: Brand
  onDelete: (b: Brand) => void
}) {
  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md">
      <Dropdown
        menu={{
          items: [
            { key: 'edit', label: 'Edit', icon: <Pencil size={13} /> },
            { key: 'delete', label: 'Delete', danger: true, icon: <Trash2 size={13} />, onClick: () => onDelete(brand) },
          ],
        }}
        trigger={['click']}
      >
        <button
          type="button"
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100"
        >
          <MoreVertical size={15} />
        </button>
      </Dropdown>

      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold ${brand.color} ${brand.textColor}`}>
        {brand.name.charAt(0)}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <h4 className="truncate text-sm font-semibold text-[#314158]">{brand.name}</h4>
        <ModulePill label={brand.status} variant={brand.status === 'Active' ? 'green' : 'slate'} />
      </div>
      <p className="mt-0.5 font-mono text-[10px] text-slate-400">{brand.code}</p>
      <p className="mt-2 line-clamp-2 min-h-8 text-xs text-slate-500">{brand.description}</p>

      <div className="mt-3 border-t border-slate-100 pt-2.5">
        <span className="text-xs font-medium text-slate-500">
          {brand.productCount.toLocaleString('en-IN')} products
        </span>
      </div>
    </div>
  )
}

export default function BrandsTab() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-brands'],
    queryFn: inventorySetupService.getBrands,
  })
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)

  const filtered = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [brands, search]
  )

  return (
    <div>
      <TabToolbar
        title="Brands"
        count={filtered.length}
        onSearch={setSearch}
        searchPlaceholder="Search brands..."
        actions={
          <PrimaryButton icon={<Plus size={14} />} label="New Brand" onClick={() => setCreateOpen(true)} />
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((brand) => (
            <BrandCard key={brand.id} brand={brand} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <CreateBrandDrawer isOpen={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
      />
    </div>
  )
}
