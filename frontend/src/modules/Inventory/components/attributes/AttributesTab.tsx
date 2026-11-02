import { useMemo, useState } from 'react'
import { Pencil, Plus, Upload, Download, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  ATTRIBUTE_COLUMNS,
  DEFAULT_ATTRIBUTES,
  type AttributeDef,
} from './attributeDefs'

interface TableRowData {
  id: string
  isActionRow?: boolean
  values: Record<string, string>
}

const INITIAL_ROWS: TableRowData[] = [
  {
    id: 'row-0',
    isActionRow: true,
    values: {
      col_1: '', // Render + New button
      col_2: 'XL',
      col_3: 'Cotton',
      col_4: 'Piece',
      col_5: '250g',
      col_6: 'Slim Fit',
      col_7: 'Leather',
      col_8: 'Standard',
    },
  },
  {
    id: 'row-1',
    values: {
      col_1: 'Blue Color',
      col_2: 'S',
      col_3: 'Polyester',
      col_4: 'Box',
      col_5: '500g',
      col_6: 'Athletic Fit',
      col_7: 'Nylon',
      col_8: 'Pro',
    },
  },
  {
    id: 'row-2',
    values: {
      col_1: 'Black Color',
      col_2: 'M',
      col_3: 'Wool',
      col_4: 'Dozen',
      col_5: '100g',
      col_6: 'Loose Fit',
      col_7: 'Wool',
      col_8: 'Max',
    },
  },
  {
    id: 'row-3',
    values: {
      col_1: 'Green Color',
      col_2: 'XXL',
      col_3: 'Silk',
      col_4: 'Packet',
      col_5: '1Kg',
      col_6: 'Classic Fit',
      col_7: 'Cotton Blend',
      col_8: 'Lite',
    },
  },
  {
    id: 'row-4',
    values: {
      col_1: 'White Color',
      col_2: 'L',
      col_3: 'Denim',
      col_4: 'Carton',
      col_5: '300g',
      col_6: 'Regular Fit',
      col_7: 'Silk',
      col_8: 'Plus',
    },
  },
  {
    id: 'row-5',
    values: {
      col_1: 'Red Color',
      col_2: 'XS',
      col_3: 'Linen',
      col_4: 'Kg',
      col_5: '450g',
      col_6: 'Tailored Fit',
      col_7: 'Polyester Blend',
      col_8: 'Ultra',
    },
  },
  {
    id: 'row-6',
    values: {
      col_1: 'Yellow Color',
      col_2: '3XL',
      col_3: 'Leather',
      col_4: 'Pair',
      col_5: '350g',
      col_6: 'Fitted Fit',
      col_7: 'Spandex',
      col_8: 'Special Edition',
    },
  },
  {
    id: 'row-7',
    values: {
      col_1: 'Purple Color',
      col_2: 'Free Size',
      col_3: 'Spandex',
      col_4: 'Set',
      col_5: '600g',
      col_6: 'Oversized Fit',
      col_7: 'Cashmere',
      col_8: 'Bundle Pack',
    },
  },
  {
    id: 'row-8',
    values: {
      col_1: 'Pink Color',
      col_2: 'UK 8',
      col_3: 'Nylon',
      col_4: 'Meter',
      col_5: '200g',
      col_6: 'Modern Fit',
      col_7: 'Linen Blend',
      col_8: 'Premium Pack',
    },
  },
  {
    id: 'row-9',
    values: {
      col_1: 'Orange Color',
      col_2: 'UK 9',
      col_3: 'Rayon',
      col_4: 'Liter',
      col_5: '750g',
      col_6: 'Relaxed Fit',
      col_7: 'Denim Twill',
      col_8: 'Limited Edition',
    },
  },
  {
    id: 'row-10',
    values: {
      col_1: 'Navy Color',
      col_2: 'UK 10',
      col_3: 'Canvas',
      col_4: 'Bottle',
      col_5: '1.5Kg',
      col_6: 'Skinny Fit',
      col_7: 'Fleece',
      col_8: 'Basic Edition',
    },
  },
]

/**
 * Add Attribute Modal matching reference screenshot:
 * Header: "Add Attribute 1"
 * Label: "Attribute Name *"
 * Input placeholder: "e.g. Samsung Electronics"
 * Footer: "Cancel" and "+ New Attribute"
 */
function AddNewAttributeModal({
  isOpen,
  onClose,
  attributeTitle = 'Attribute 1',
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  attributeTitle?: string
  onSave: (name: string) => void
}) {
  // Seeded once per open: the parent gives the modal a key that changes every
  // time it opens, so this component remounts and the input starts empty.
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter an attribute name')
      return
    }
    onSave(name.trim())
    toast.success(`Attribute "${name.trim()}" added to ${attributeTitle}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0F3F91]">
            Add {attributeTitle}
          </h3>

          {/* Form Body */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-800">
              Attribute Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Samsung Electronics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-slate-200 bg-white px-5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-[#155DFC] px-5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1048c7] cursor-pointer"
            >
              <Plus size={14} className="text-white" />
              <span>New Attribute</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Edit Attributes Modal from previous step
 */
export function EditAttributesModal({
  isOpen,
  onClose,
  attributes = DEFAULT_ATTRIBUTES,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  attributes?: AttributeDef[]
  onSave?: (updated: AttributeDef[]) => void
}) {
  // Seeded once per open via a changing key from the parent (same pattern as
  // the other modals), so no reset effect is needed.
  const [formAttrs, setFormAttrs] = useState<AttributeDef[]>(attributes)

  const handleTitleChange = (key: string, value: string) => {
    setFormAttrs((prev) =>
      prev.map((attr) => (attr.key === key ? { ...attr, title: value } : attr))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formAttrs)
    toast.success('Attributes updated successfully')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Pencil size={18} className="text-[#155DFC]" strokeWidth={2.2} />
              <h3 className="text-base font-bold text-slate-900">
                Edit Attributes
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Rename the custom attributes for your current inventory catalog. These
            titles will reflect across all product setup fields.
          </p>

          {/* Form Fields: Attribute 1 to 8 */}
          <div className="mt-5 space-y-3.5">
            {formAttrs.map((attr) => (
              <div key={attr.key} className="flex items-center gap-4">
                <label className="w-24 shrink-0 text-xs font-semibold text-slate-800">
                  {attr.label}
                </label>
                <input
                  type="text"
                  value={attr.title}
                  onChange={(e) => handleTitleChange(attr.key, e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-slate-200 bg-white px-5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 rounded-lg bg-[#155DFC] px-5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1048c7] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AttributesTab() {
  const [rows, setRows] = useState<TableRowData[]>(INITIAL_ROWS)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [newAttrModalOpen, setNewAttrModalOpen] = useState(false)
  const [selectedAttributeTitle, setSelectedAttributeTitle] = useState('Attribute 1')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [attributes, setAttributes] = useState<AttributeDef[]>(DEFAULT_ATTRIBUTES)

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      if (r.isActionRow) return true
      return Object.values(r.values).some((v) => v.toLowerCase().includes(q))
    })
  }, [rows, search])

  const handleExport = () => {
    const headers = ATTRIBUTE_COLUMNS.map((c) => c.label).join(',') + '\n'
    const csvRows = rows
      .filter((r) => !r.isActionRow)
      .map((r) =>
        ATTRIBUTE_COLUMNS.map((c) => `"${r.values[c.key] || ''}"`).join(',')
      )
      .join('\n')

    const blob = new Blob([headers + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `attributes_export_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Attributes exported to CSV')
  }

  const handleAddAttributeValue = (val: string) => {
    const targetCol =
      ATTRIBUTE_COLUMNS.find((c) => c.label === selectedAttributeTitle)?.key ||
      'col_1'

    const newRow: TableRowData = {
      id: `row-${Date.now()}`,
      values: {
        col_1: targetCol === 'col_1' ? val : 'Blue Color',
        col_2: targetCol === 'col_2' ? val : 'M',
        col_3: targetCol === 'col_3' ? val : 'Cotton',
        col_4: targetCol === 'col_4' ? val : 'Piece',
        col_5: targetCol === 'col_5' ? val : '250g',
        col_6: targetCol === 'col_6' ? val : 'Regular Fit',
        col_7: targetCol === 'col_7' ? val : 'Cotton Blend',
        col_8: targetCol === 'col_8' ? val : 'Standard',
      },
    }

    setRows((prev) => [prev[0], newRow, ...prev.slice(1)])
  }

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Heading, count, search, filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-bold leading-tight text-slate-900">
              Attributes
            </h2>
            <span className="text-xs text-slate-400">10 records</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-44 sm:w-52 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium shadow-2xs transition cursor-pointer ${
              showFilters
                ? 'border-[#155DFC] bg-blue-50 text-[#155DFC]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter
              size={13}
              className={showFilters ? 'text-[#155DFC]' : 'text-slate-500'}
            />
            <span>Filters</span>
          </button>
        </div>

        {/* Right: Export, Import, Edit Attribute */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Upload size={13} className="text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => toast.success('Import ready')}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#155DFC] px-3.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1048c7] cursor-pointer"
          >
            <Pencil size={13} className="text-white" />
            <span>Edit Attribute</span>
          </button>
        </div>
      </div>

      {/* Attributes Table Grid with 8 Columns (Color, Size, Material, Unit, Weight, Fit, Fabric, Variant) */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-none">
        <table className="w-full min-w-[800px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              {ATTRIBUTE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.hasPlus && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAttributeTitle(col.label)
                          setNewAttrModalOpen(true)
                        }}
                        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-[#155DFC] text-white text-[10px] font-bold leading-none shadow-2xs hover:bg-[#1048c7] transition cursor-pointer"
                        title={`Add ${col.label} (${col.title})`}
                      >
                        +
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {ATTRIBUTE_COLUMNS.map((col) => {
                  if (row.isActionRow && col.key === 'col_1') {
                    return (
                      <td key={col.key} className="px-4 py-2.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttributeTitle(col.label)
                            setNewAttrModalOpen(true)
                          }}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                        >
                          <Plus size={12} className="text-slate-600" />
                          <span>New</span>
                        </button>
                      </td>
                    )
                  }

                  return (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap"
                    >
                      {row.values[col.key] || '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Attribute Modal (triggered by + New button or [+] icon) */}
      <AddNewAttributeModal
        key={`new-attr-${newAttrModalOpen}`}
        isOpen={newAttrModalOpen}
        onClose={() => setNewAttrModalOpen(false)}
        attributeTitle={selectedAttributeTitle}
        onSave={handleAddAttributeValue}
      />

      {/* Edit Attributes Modal (retained from previous request) */}
      <EditAttributesModal
        key={`edit-attr-${editModalOpen}-${attributes.map((a) => a.key + a.title).join('|')}`}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        attributes={attributes}
        onSave={(updated) => setAttributes(updated)}
      />
    </div>
  )
}