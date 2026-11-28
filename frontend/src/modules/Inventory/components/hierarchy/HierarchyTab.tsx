import { useMemo, useState } from 'react'
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Layers,
  MoveRight,
  Plus,
  Tags,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/shared/Modal'
import { FieldWrap, SelectInput, TextInput } from '../shared/formControls'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import {
  MOCK_HIERARCHY_NODES,
  type HierarchyLevel,
  type HierarchyNode,
} from './hierarchy.mock'

type TreeNode = HierarchyNode & {
  children: TreeNode[]
  childCount: number
}

type NodeEditorState = {
  editingNode: HierarchyNode | null
  level: HierarchyLevel
  parentId: number | null
}

const LEVEL_LABELS: Record<HierarchyLevel, string> = {
  GROUP: 'Group',
  DEPARTMENT: 'Department',
  SECTION: 'Section',
}

const LEVEL_BADGE_CLASSES: Record<HierarchyLevel, string> = {
  GROUP: 'bg-[#0F2A66] text-white',
  DEPARTMENT: 'bg-indigo-600 text-white',
  SECTION: 'bg-purple-100 text-purple-700',
}

function buildTree(nodes: HierarchyNode[]): TreeNode[] {
  const nodesById = new Map<number, TreeNode>()
  nodes.forEach((node) => nodesById.set(node.id, { ...node, children: [], childCount: 0 }))

  const roots: TreeNode[] = []
  nodes.forEach((node) => {
    const treeNode = nodesById.get(node.id)
    if (!treeNode) return
    if (node.parentId === null) {
      roots.push(treeNode)
      return
    }

    const parent = nodesById.get(node.parentId)
    if (parent) {
      parent.children.push(treeNode)
      parent.childCount += 1
    }
  })

  return roots
}

function filterTree(nodes: TreeNode[], visibleIds: Set<number>): TreeNode[] {
  return nodes
    .filter((node) => visibleIds.has(node.id))
    .map((node) => ({
      ...node,
      children: filterTree(node.children, visibleIds),
    }))
}

function getNodeLabel(node: HierarchyNode): string {
  return `${LEVEL_LABELS[node.level]} ${node.name}`
}

function NodeEditorModal({
  nodes,
  editingNode,
  level,
  parent,
  onClose,
  onSave,
}: {
  nodes: HierarchyNode[]
  editingNode: HierarchyNode | null
  level: HierarchyLevel
  parent: HierarchyNode | null
  onClose: () => void
  onSave: (code: string, name: string) => void
}) {
  const [code, setCode] = useState(editingNode?.code ?? '')
  const [name, setName] = useState(editingNode?.name ?? '')
  const [submitted, setSubmitted] = useState(false)
  const parentId = editingNode?.parentId ?? parent?.id ?? null
  const hasDuplicateCode =
    code.trim() !== '' &&
    nodes.some(
      (node) =>
        node.id !== editingNode?.id &&
        node.parentId === parentId &&
        node.code.toUpperCase() === code.trim().toUpperCase(),
    )
  const codeError = hasDuplicateCode
    ? 'Code must be unique among siblings'
    : submitted && !code.trim()
      ? 'Code is required'
      : undefined
  const nameError = submitted && !name.trim() ? 'Name is required' : undefined
  const levelLabel = LEVEL_LABELS[level]
  const title = editingNode
    ? `Edit ${levelLabel}`
    : parent
      ? `Add ${levelLabel} to ${parent.name}`
      : 'New Group'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (!code.trim() || !name.trim() || hasDuplicateCode) return
    onSave(code.trim(), name.trim())
  }

  return (
    <Modal isOpen onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-[#043793]">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Enter the code and name for this {levelLabel.toLowerCase()}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hierarchy editor"
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <FieldWrap label="Code" required>
            <TextInput
              placeholder="Letters and numbers"
              value={code}
              onChange={(value) =>
                setCode(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))
              }
            />
            {codeError && <p role="alert" className="text-xs text-red-600">{codeError}</p>}
          </FieldWrap>
          <FieldWrap label="Name" required>
            <TextInput
              placeholder={`Enter ${levelLabel.toLowerCase()} name`}
              value={name}
              onChange={(value) => setName(value.slice(0, 50))}
            />
            {nameError && <p role="alert" className="text-xs text-red-600">{nameError}</p>}
          </FieldWrap>
          <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            Parent: <span className="font-medium text-slate-700">{parent?.name ?? '—'}</span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 rounded-lg bg-[#155DFC] px-4 text-xs font-medium text-white hover:bg-[#1447E6]"
          >
            {editingNode ? 'Save changes' : `Add ${levelLabel}`}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function MoveNodeModal({
  nodes,
  onClose,
  onMove,
}: {
  nodes: HierarchyNode[]
  onClose: () => void
  onMove: (nodeId: number, parentId: number) => void
}) {
  const [nodeId, setNodeId] = useState<number>()
  const [parentId, setParentId] = useState<number>()
  const movingNode = nodes.find((node) => node.id === nodeId)
  const parentLevel =
    movingNode?.level === 'DEPARTMENT'
      ? 'GROUP'
      : movingNode?.level === 'SECTION'
        ? 'DEPARTMENT'
        : undefined
  const parentOptions = nodes
    .filter((node) => node.level === parentLevel)
    .map((node) => ({
      value: String(node.id),
      label: `${node.name} (${node.code})`,
    }))
  const hasCodeConflict =
    movingNode !== undefined &&
    parentId !== undefined &&
    nodes.some(
      (node) =>
        node.id !== movingNode.id &&
        node.parentId === parentId &&
        node.code.toUpperCase() === movingNode.code.toUpperCase(),
    )

  return (
    <Modal isOpen onClose={onClose} maxWidth="md">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#043793]">Move hierarchy node</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Choose a department or section and its new parent.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close move dialog"
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4 px-6 py-5">
        <FieldWrap label="Department or Section" required>
          <SelectInput
            options={nodes
              .filter((node) => node.level !== 'GROUP')
              .map((node) => ({
                value: String(node.id),
                label: `${LEVEL_LABELS[node.level]} · ${node.name} (${node.code})`,
              }))}
            value={nodeId === undefined ? '' : String(nodeId)}
            placeholder="Select node"
            onChange={(value) => {
              setNodeId(Number(value))
              setParentId(undefined)
            }}
          />
        </FieldWrap>
        <FieldWrap label="New parent" required>
          <SelectInput
            options={parentOptions}
            value={parentId === undefined ? '' : String(parentId)}
            placeholder="Select parent"
            disabled={!movingNode}
            onChange={(value) => setParentId(Number(value))}
          />
        </FieldWrap>
        {hasCodeConflict && (
          <p role="alert" className="text-xs text-red-600">
            Code must be unique among siblings under the new parent.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!movingNode || parentId === undefined || hasCodeConflict}
          onClick={() => {
            if (nodeId !== undefined && parentId !== undefined && !hasCodeConflict) {
              onMove(nodeId, parentId)
            }
          }}
          className="h-9 rounded-lg bg-[#155DFC] px-4 text-xs font-medium text-white hover:bg-[#1447E6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Move
        </button>
      </div>
    </Modal>
  )
}

function HierarchyRows({
  nodes,
  depth,
  expanded,
  forcedExpanded,
  onToggle,
  onAdd,
  onEdit,
}: {
  nodes: TreeNode[]
  depth: number
  expanded: Set<number>
  forcedExpanded: Set<number>
  onToggle: (id: number) => void
  onAdd: (node: HierarchyNode) => void
  onEdit: (node: HierarchyNode) => void
}) {
  return (
    <div
      role={depth === 0 ? 'tree' : 'group'}
      className={
        depth === 0
          ? 'space-y-1'
          : 'ml-5 space-y-1 border-l border-slate-200 pl-4'
      }
    >
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0
        const isExpanded = expanded.has(node.id) || forcedExpanded.has(node.id)
        const childLevelLabel = node.level === 'GROUP' ? 'department' : 'section'

        return (
          <div key={node.id}>
            <div
              role="treeitem"
              tabIndex={0}
              aria-expanded={hasChildren ? isExpanded : undefined}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  event.target === event.currentTarget &&
                  hasChildren
                ) {
                  event.preventDefault()
                  onToggle(node.id)
                }
              }}
              className="flex min-h-9 items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
            >
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${getNodeLabel(node)}`}
                  onClick={() => onToggle(node.id)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <span className="h-6 w-6 shrink-0" aria-hidden="true" />
              )}
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-medium ${LEVEL_BADGE_CLASSES[node.level]}`}
              >
                {LEVEL_LABELS[node.level]}
              </span>
              <span className="w-20 shrink-0 font-mono text-xs text-[#155DFC]">{node.code}</span>
              <button
                type="button"
                onClick={() => onEdit(node)}
                className="min-w-0 flex-1 truncate text-left text-sm font-medium text-slate-800"
              >
                {node.name}
              </button>
              <span className="shrink-0 text-xs text-slate-400">({node.childCount})</span>
              {node.level !== 'SECTION' && (
                <button
                  type="button"
                  aria-label={`Add ${childLevelLabel} to ${node.name}`}
                  onClick={() => onAdd(node)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
            {isExpanded && node.children.length > 0 && (
              <HierarchyRows
                nodes={node.children}
                depth={depth + 1}
                expanded={expanded}
                forcedExpanded={forcedExpanded}
                onToggle={onToggle}
                onAdd={onAdd}
                onEdit={onEdit}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function SummaryCard({
  label,
  count,
  icon,
}: {
  label: string
  count: number
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#155DFC]">
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold text-slate-900">{count}</p>
      </div>
    </div>
  )
}

export default function HierarchyTab() {
  const [nodes, setNodes] = useState<HierarchyNode[]>(() =>
    MOCK_HIERARCHY_NODES.map((node) => ({ ...node })),
  )
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(MOCK_HIERARCHY_NODES.filter((node) => node.level !== 'SECTION').map((node) => node.id)),
  )
  const [nodeEditor, setNodeEditor] = useState<NodeEditorState | null>(null)
  const [moveOpen, setMoveOpen] = useState(false)

  const tree = useMemo(() => buildTree(nodes), [nodes])
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    const visibleIds = new Set<number>()
    const ancestorIds = new Set<number>()
    if (!query) return { visibleIds: null, ancestorIds }

    const nodesById = new Map(nodes.map((node) => [node.id, node]))
    nodes.forEach((node) => {
      if (
        !node.code.toLowerCase().includes(query) &&
        !node.name.toLowerCase().includes(query)
      ) {
        return
      }

      visibleIds.add(node.id)
      let parentId = node.parentId
      while (parentId !== null) {
        const parent = nodesById.get(parentId)
        if (!parent) break
        visibleIds.add(parent.id)
        ancestorIds.add(parent.id)
        parentId = parent.parentId
      }
    })

    return { visibleIds, ancestorIds }
  }, [nodes, search])
  const visibleTree = useMemo(
    () =>
      searchResults.visibleIds
        ? filterTree(tree, searchResults.visibleIds)
        : tree,
    [tree, searchResults],
  )
  const counts = useMemo(
    () => ({
      groups: nodes.filter((node) => node.level === 'GROUP').length,
      departments: nodes.filter((node) => node.level === 'DEPARTMENT').length,
      sections: nodes.filter((node) => node.level === 'SECTION').length,
    }),
    [nodes],
  )

  const toggleNode = (id: number) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAdd = (parent: HierarchyNode | null) => {
    const level: HierarchyLevel = parent
      ? parent.level === 'GROUP'
        ? 'DEPARTMENT'
        : 'SECTION'
      : 'GROUP'
    setNodeEditor({ editingNode: null, level, parentId: parent?.id ?? null })
    if (parent) {
      setExpanded((previous) => new Set(previous).add(parent.id))
    }
  }

  const openEdit = (node: HierarchyNode) => {
    setNodeEditor({ editingNode: node, level: node.level, parentId: node.parentId })
  }

  const saveNode = (code: string, name: string) => {
    if (!nodeEditor) return

    // TODO: Persist hierarchy changes through the Hierarchy API when available.
    if (nodeEditor.editingNode) {
      const editedId = nodeEditor.editingNode.id
      setNodes((previous) =>
        previous.map((node) => (node.id === editedId ? { ...node, code, name } : node)),
      )
      toast.success(`${LEVEL_LABELS[nodeEditor.level]} updated successfully`)
    } else {
      const newNode: HierarchyNode = {
        id: nodes.reduce((highestId, node) => Math.max(highestId, node.id), 0) + 1,
        code,
        name,
        level: nodeEditor.level,
        parentId: nodeEditor.parentId,
        status: 'ACTIVE',
      }
      setNodes((previous) => [...previous, newNode])
      toast.success(`${LEVEL_LABELS[nodeEditor.level]} added successfully`)
    }

    setNodeEditor(null)
  }

  const moveNode = (nodeId: number, parentId: number) => {
    const movingNode = nodes.find((node) => node.id === nodeId)
    if (!movingNode) return

    // TODO: Persist hierarchy moves through the Hierarchy API when available.
    setNodes((previous) =>
      previous.map((node) => (node.id === nodeId ? { ...node, parentId } : node)),
    )
    toast.success(`${LEVEL_LABELS[movingNode.level]} moved successfully`)
    setMoveOpen(false)
  }

  const editorParent =
    nodeEditor?.parentId === null || nodeEditor?.parentId === undefined
      ? null
      : nodes.find((node) => node.id === nodeEditor.parentId) ?? null

  return (
    <div>
      <TabToolbar
        title="Product Hierarchy"
        count={nodes.length}
        searchPlaceholder="Search groups, departments, sections..."
        onSearch={setSearch}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Groups" count={counts.groups} icon={<Tags size={17} />} />
        <SummaryCard label="Departments" count={counts.departments} icon={<Building2 size={17} />} />
        <SummaryCard label="Sections" count={counts.sections} icon={<Layers size={17} />} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Hierarchy Tree</h3>
          <div className="flex items-center gap-2">
            <GhostButton
              icon={<MoveRight size={14} className="text-slate-500" />}
              label="Move"
              onClick={() => setMoveOpen(true)}
            />
            <PrimaryButton
              icon={<Plus size={14} />}
              label="New Group"
              onClick={() => openAdd(null)}
            />
          </div>
        </div>

        {visibleTree.length > 0 ? (
          <div className="p-3">
            <HierarchyRows
              nodes={visibleTree}
              depth={0}
              expanded={expanded}
              forcedExpanded={searchResults.ancestorIds}
              onToggle={toggleNode}
              onAdd={openAdd}
              onEdit={openEdit}
            />
          </div>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            No matching groups, departments or sections
          </p>
        )}
      </section>

      {nodeEditor && (
        <NodeEditorModal
          key={`${nodeEditor.editingNode?.id ?? 'new'}-${nodeEditor.parentId ?? 'root'}`}
          nodes={nodes}
          editingNode={nodeEditor.editingNode}
          level={nodeEditor.level}
          parent={editorParent}
          onClose={() => setNodeEditor(null)}
          onSave={saveNode}
        />
      )}
      {moveOpen && (
        <MoveNodeModal
          nodes={nodes}
          onClose={() => setMoveOpen(false)}
          onMove={moveNode}
        />
      )}
    </div>
  )
}
