import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Folder, FolderOpen, Plus, Tags } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { HierarchyNode, HierarchyNodeType } from '@/types/inventorySetup'
import TabToolbar, { PrimaryButton } from '../shared/TabToolbar'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput } from '../shared/formControls'

const NODE_META: Record<HierarchyNodeType, { childType: HierarchyNodeType | null; childLabel: string; indent: number }> = {
  department: { childType: 'section', childLabel: 'Section', indent: 0 },
  section: { childType: 'category', childLabel: 'Category', indent: 1 },
  category: { childType: 'subCategory', childLabel: 'Sub-Category', indent: 2 },
  subCategory: { childType: null, childLabel: '', indent: 3 },
}

function AddNodeModal({
  isOpen,
  onClose,
  parent,
}: {
  isOpen: boolean
  onClose: () => void
  parent: HierarchyNode | null
}) {
  const childType = parent ? NODE_META[parent.type].childType : 'department'
  const childLabel = parent ? NODE_META[parent.type].childLabel : 'Department'

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#043793]">
            Add {childLabel}
            {parent ? ` to ${parent.name}` : ''}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {childLabel} code is auto-generated from the parent code.
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label={`${childLabel} Name`} required>
            <TextInput placeholder={`e.g. ${childType === 'section' ? 'Mobiles' : 'Electronics'}`} />
          </FieldWrap>
          <FieldWrap label={`${childLabel} Code`}>
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
          <FieldWrap label="Description">
            <TextInput placeholder="Short description (optional)" />
          </FieldWrap>
          <FieldWrap label="Status">
            <SelectInput options={['Active', 'Inactive']} placeholder="Select Status" />
          </FieldWrap>
        </div>

        {parent && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <Folder size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">
              Parent: <span className="font-medium text-[#314158]">{parent.name}</span> ({parent.code})
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-[#314158] hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg bg-[#155DFC] px-5 text-sm font-medium text-white hover:bg-[#1447E6]"
        >
          Add {childLabel}
        </button>
      </div>
    </Modal>
  )
}

function TreeNode({
  node,
  depth,
  expanded,
  onToggle,
  onAdd,
}: {
  node: HierarchyNode
  depth: number
  expanded: Set<string>
  onToggle: (id: string) => void
  onAdd: (parent: HierarchyNode) => void
}) {
  const isOpen = expanded.has(node.id)
  const hasChildren = node.children.length > 0
  const meta = NODE_META[node.type]

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 transition hover:border-slate-200 hover:shadow-sm"
        style={{ marginLeft: depth * 28 }}
      >
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          className={`flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition ${
            hasChildren ? 'hover:bg-slate-100' : 'invisible'
          }`}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            depth === 0 ? 'bg-[#EFF6FF]' : 'bg-slate-50'
          }`}
        >
          {node.type === 'department' ? (
            <Tags size={14} className="text-[#155DFC]" />
          ) : isOpen ? (
            <FolderOpen size={14} className="text-slate-500" />
          ) : (
            <Folder size={14} className="text-slate-500" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#314158]">{node.name}</p>
          <p className="font-mono text-[10px] text-slate-400">{node.code}</p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {node.productCount.toLocaleString('en-IN')} products
        </span>

        {meta.childType && (
          <button
            type="button"
            onClick={() => onAdd(node)}
            className="flex h-7 shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[11px] font-medium text-[#314158] opacity-0 transition group-hover:opacity-100 hover:bg-slate-50"
          >
            <Plus size={12} /> Add {meta.childLabel}
          </button>
        )}
      </div>

      {isOpen &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
            onAdd={onAdd}
          />
        ))}
    </div>
  )
}

export default function HierarchyTab() {
  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-hierarchy'],
    queryFn: inventorySetupService.getHierarchy,
  })

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(['dep-electronics', 'sec-mobiles'])
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [parent, setParent] = useState<HierarchyNode | null>(null)

  const totalNodes = useMemo(() => {
    let count = 0
    const walk = (nodes: HierarchyNode[]) => {
      for (const n of nodes) {
        count += 1
        walk(n.children)
      }
    }
    walk(tree)
    return count
  }, [tree])

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const openAdd = (parent: HierarchyNode | null) => {
    setParent(parent)
    setModalOpen(true)
  }

  return (
    <div>
      <TabToolbar
        title="Product Hierarchy"
        count={totalNodes}
        actions={
          <PrimaryButton icon={<Plus size={14} />} label="New Department" onClick={() => openAdd(null)} />
        }
      />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-slate-50" />
      ) : (
        <div className="space-y-2">
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              expanded={expanded}
              onToggle={toggle}
              onAdd={openAdd}
            />
          ))}
        </div>
      )}

      <AddNodeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} parent={parent} />
    </div>
  )
}
