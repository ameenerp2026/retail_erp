import { useMemo, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import Drawer from '@/components/shared/Drawer'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { Barcode, DataVerificationRow } from '@/types/inventorySetup'
import { DATA_VERIFICATION_MOCK } from '@/mocks/inventorySetup.mock'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import PrintBarcodesDrawer from './PrintBarcodesDrawer'
import toast from 'react-hot-toast'
import { exportToCSV } from '@/utils/exportData'

/* ---------- Bulk: data verification modal (design-29) ---------- */

function DataVerificationModal({
  isOpen,
  onClose,
  onContinue,
}: {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}) {
  const data = DATA_VERIFICATION_MOCK
  const statusPill = (s: DataVerificationRow['status']) =>
    s === 'Valid' ? (
      <ModulePill label="Valid" variant="green" />
    ) : s === 'Missing Code' ? (
      <ModulePill label="Missing Code" variant="amber" />
    ) : (
      <ModulePill label="Duplicate" variant="red" />
    )

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#043793]">Data Verification</h3>
          <p className="mt-0.5 text-xs text-slate-400">Check and resolve file import conflicts</p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      {/* summary counters */}
      <div className="grid grid-cols-4 gap-2 border-b border-slate-100 px-6 py-4">
        {[
          { label: 'TOTAL RECORDS', value: data.total, color: 'text-[#314158]' },
          { label: 'VALID', value: `● ${data.valid}`, color: 'text-[#009966]' },
          { label: 'ISSUES', value: `● ${data.issues}`, color: 'text-[#E17100]' },
          { label: 'DUPLICATES', value: `● ${data.duplicates}`, color: 'text-[#E7000B]' },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* conflict table */}
      <div className="max-h-56 overflow-y-auto border-b border-slate-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-6 py-2.5 font-semibold">Row</th>
              <th className="px-3 py-2.5 font-semibold">Product Name</th>
              <th className="px-3 py-2.5 font-semibold">Product Code</th>
              <th className="px-3 py-2.5 font-semibold">MRP</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr
                key={r.row}
                className={`border-t border-slate-50 ${r.status === 'Missing Code' ? 'bg-[#FFFBEB]' : r.status === 'Duplicate' ? 'bg-[#FEF2F2]' : ''
                  }`}
              >
                <td className="px-6 py-2.5 text-slate-500">{r.row}</td>
                <td className="px-3 py-2.5 font-medium text-[#314158]">{r.productName}</td>
                <td className={`px-3 py-2.5 font-mono ${r.productCode ? 'text-[#155DFC]' : 'font-bold text-[#E7000B]'}`}>
                  {r.productCode ?? 'MISSING'}
                </td>
                <td className="px-3 py-2.5 text-slate-500">{r.mrp}</td>
                <td className="px-3 py-2.5">{statusPill(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* system notes */}
      <div className="bg-[#FEF2F2] px-6 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#E7000B]">System Resolutions &amp; Errors:</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-[#7F1D1D]">
          {data.systemNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg border border-slate-200 px-4 text-sm font-medium text-[#314158] hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-9 rounded-lg border border-slate-200 px-4 text-sm font-medium text-[#314158] hover:bg-slate-50"
        >
          Fix &amp; Re-upload
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="h-9 rounded-lg bg-[#155DFC] px-4 text-sm font-medium text-white hover:bg-[#1447E6]"
        >
          Continue with Valid (242)
        </button>
      </div>
    </Modal>
  )
}

/* ---------- Label Templates & Modal (Design Selection) ---------- */

const LABEL_TEMPLATES = [
  {
    key: 'standard',
    title: 'Standard Label',
    description: 'Includes product name, MRP, selling price, and a standard EAN barcode.',
  },
  {
    key: 'company',
    title: 'Label with Company Details',
    description: 'Includes retail company name, support details, and custom logo on top.',
  },
  {
    key: 'garment',
    title: 'Garment Label Sticker',
    description: 'Perfect for fashion/clothing. Shows size (S/M/L/XL), color and price.',
  },
  {
    key: 'jewelry',
    title: 'Jewelry Label Sticker',
    description: 'Ultra-narrow dumbbell template containing catalog style code and MRP.',
  },
  {
    key: 'detailed',
    title: 'Detailed Product Label',
    description: 'Ideal for shipping and cartons. Shows warehouse row, batch, and weight.',
  },
  {
    key: 'priceTag',
    title: 'Price Tag Label',
    description: 'Highlights a large discounted sale price on a highly visible layout.',
  },
]

function LabelTemplateModal({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
  onContinue,
}: {
  isOpen: boolean
  onClose: () => void
  selectedTemplate: string
  onSelectTemplate: (key: string) => void
  onContinue: () => void
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[0.5px] flex items-center justify-center z-[10000] p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl max-h-[92vh] flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LABEL_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.key
            return (
              <div
                key={tmpl.key}
                onClick={() => onSelectTemplate(tmpl.key)}
                className={`rounded-2xl border p-4.5 text-left transition cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#155DFC] bg-white shadow-md'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Header row: Title & Radio Indicator */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {tmpl.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed min-h-[34px]">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#155DFC] bg-white">
                        <div className="h-2 w-2 rounded-full bg-[#155DFC]" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 bg-white" />
                    )}
                  </div>
                </div>

                {/* Preview Graphic Area */}
                <div className="mt-3 flex h-24 w-full items-center justify-center rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                  {tmpl.key === 'standard' && (
                    <div className="flex flex-col items-center justify-center rounded-md bg-white p-2 shadow-xs border border-slate-200/80 w-36">
                      <div className="w-full flex justify-between items-center text-[7px] text-slate-500 font-medium mb-1">
                        <span className="truncate max-w-[70px]">Galaxy A54 5G</span>
                        <span className="font-bold text-slate-800">₹34,999</span>
                      </div>
                      <div className="flex items-center gap-[2px] h-6 py-0.5">
                        {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3].map((w, idx) => (
                          <span key={idx} className="h-full bg-slate-800" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="font-mono text-[7px] text-slate-500 tracking-wider mt-0.5">
                        8806094760583
                      </span>
                    </div>
                  )}

                  {tmpl.key === 'company' && (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center justify-center rounded-md bg-white px-2.5 py-1.5 shadow-xs border border-slate-200/80 w-32">
                        <div className="text-center border-b border-slate-100 pb-0.5 mb-1 w-full">
                          <span className="block text-[8px] font-bold text-[#0B3B95] leading-none">
                            STREAMYS RETAIL
                          </span>
                          <span className="block text-[6px] text-slate-400 mt-0.5">
                            Customer Care: 1800-001
                          </span>
                        </div>
                        <div className="flex items-center gap-[2px] h-4">
                          {[2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3].map((w, idx) => (
                            <span key={idx} className="h-full bg-slate-800" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-md bg-white px-2 py-1.5 shadow-xs border border-slate-200/80 w-24">
                        <span className="text-[7px] font-bold text-slate-700">STORE #102</span>
                        <div className="flex items-center gap-[1.5px] h-4 mt-0.5">
                          {[1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 3].map((w, idx) => (
                            <span key={idx} className="h-full bg-slate-800" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tmpl.key === 'garment' && (
                    <div className="flex items-center justify-between rounded-lg bg-white px-3.5 py-2 shadow-xs border border-slate-200/80 w-44">
                      <div className="flex flex-col items-start gap-1">
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-[9px] font-bold text-sky-800 tracking-wide">
                          SIZE: M
                        </span>
                        <span className="text-[11px] font-black text-[#155DFC]">
                          ₹1,499.00
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-[1.5px] h-5">
                          {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 2].map((w, idx) => (
                            <span key={idx} className="h-full bg-slate-800" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                        <span className="font-mono text-[7px] text-slate-500 mt-0.5">
                          APP-NIK-270
                        </span>
                      </div>
                    </div>
                  )}

                  {tmpl.key === 'jewelry' && (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        <div className="flex h-8 w-14 flex-col items-center justify-center rounded-l-full bg-white shadow-xs border border-slate-200 px-1">
                          <span className="font-mono text-[8px] font-bold text-slate-800">JWL-01</span>
                          <span className="text-[6px] text-slate-400">18K GLD</span>
                        </div>
                        <div className="h-2 w-14 bg-slate-300 relative">
                          <div className="absolute inset-0 flex items-center justify-center gap-[1px]">
                            {[1, 1, 2, 1, 1, 2, 1, 1].map((w, idx) => (
                              <span key={idx} className="h-full bg-slate-600" style={{ width: `${w}px` }} />
                            ))}
                          </div>
                        </div>
                        <div className="flex h-8 w-14 flex-col items-center justify-center rounded-r-full bg-white shadow-xs border border-slate-200 px-1">
                          <span className="text-[8px] font-extrabold text-amber-700">₹8,999</span>
                          <span className="text-[5px] text-slate-400">NET: 2.4g</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {tmpl.key === 'detailed' && (
                    <div className="flex items-center gap-2.5 rounded-lg bg-[#EAD8C7] p-2 border border-[#D5BEA8] shadow-xs w-44">
                      <div className="h-9 w-9 rounded bg-[#D5BEA8] flex items-center justify-center shrink-0 border border-[#BFA58E]">
                        <span className="text-[9px] font-black text-[#5C4033]">PKG</span>
                      </div>
                      <div className="flex-1 rounded bg-white p-1 shadow-2xs border border-slate-200">
                        <div className="flex justify-between items-center text-[7px] font-bold text-slate-800 leading-none">
                          <span>ROW A-12</span>
                          <span>450g</span>
                        </div>
                        <div className="flex items-center gap-[1px] h-3 my-0.5">
                          {[2, 1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2].map((w, idx) => (
                            <span key={idx} className="h-full bg-slate-800" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                        <span className="font-mono text-[6px] text-slate-500 block leading-none">
                          BCH-2025-001
                        </span>
                      </div>
                    </div>
                  )}

                  {tmpl.key === 'priceTag' && (
                    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-3.5 py-2 text-white shadow-sm w-44">
                      <div className="flex flex-col">
                        <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-black text-red-900 tracking-wider w-fit">
                          SALE!
                        </span>
                        <span className="text-[7px] text-red-100 line-through mt-0.5">
                          MRP ₹99.00
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-black tracking-tight text-white leading-none">
                          ₹49.99
                        </span>
                        <span className="text-[7px] text-yellow-200 font-semibold">50% OFF</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onContinue}
            className="w-full h-11 rounded-xl bg-[#155DFC] hover:bg-[#1447E6] text-white font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ---------- Create Barcode Drawer (Slides from Right) ---------- */

interface CreateBarcodeDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddBarcode?: (barcode: Barcode) => void
  bulkVerificationOpen: boolean
  setBulkVerificationOpen: (v: boolean) => void
}

function CreateBarcodeDrawer({
  isOpen,
  onClose,
  onAddBarcode,
  bulkVerificationOpen,
  setBulkVerificationOpen,
}: CreateBarcodeDrawerProps) {
  const [mode, setMode] = useState<'manual' | 'bulk'>('manual')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('standard')
  const bulkFileInputRef = useRef<HTMLInputElement>(null)

  // Open the template selection modal first whenever Create Barcode is triggered
  useEffect(() => {
    if (isOpen) {
      setTemplateModalOpen(true)
    } else {
      setTemplateModalOpen(false)
    }
  }, [isOpen])

  const [manualForm, setManualForm] = useState({
    productCode: '',
    productName: '',
    department: '',
    section: '',
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
    sellingPrice: '',
    mrp: '',
  })

  const handleProductCodeChange = (code: string) => {
    if (!code.trim()) {
      setManualForm({
        productCode: '',
        productName: '',
        department: '',
        section: '',
        attribute1: '',
        attribute2: '',
        attribute3: '',
        attribute4: '',
        sellingPrice: '',
        mrp: '',
      })
      return
    }

    const lower = code.toLowerCase()
    if (lower.includes('13456') || lower.includes('sam') || lower.includes('ele')) {
      setManualForm({
        productCode: code,
        productName: 'Samsung Galaxy A54 5G',
        department: 'Electronics',
        section: 'Mobiles',
        attribute1: 'Awesome Graphite',
        attribute2: '128 GB',
        attribute3: 'Glass / Polycarbonate',
        attribute4: 'Samsung',
        sellingPrice: '₹34,999.00',
        mrp: '₹38,999.00',
      })
    } else if (lower.includes('nik') || lower.includes('app')) {
      setManualForm({
        productCode: code,
        productName: 'Nike Air Max 270',
        department: 'Footwear',
        section: 'Sportswear',
        attribute1: 'White / Black',
        attribute2: '9 UK',
        attribute3: 'Mesh / Rubber',
        attribute4: 'Nike',
        sellingPrice: '₹11,995.00',
        mrp: '₹13,995.00',
      })
    } else if (lower.includes('dov') || lower.includes('fmcg')) {
      setManualForm({
        productCode: code,
        productName: 'Dove Body Wash 500ml',
        department: 'Personal Care',
        section: 'Skin Cleansing',
        attribute1: 'Deep Moisture',
        attribute2: '500 ml',
        attribute3: 'Moisturizing Liquid',
        attribute4: 'Dove',
        sellingPrice: '₹449.00',
        mrp: '₹499.00',
      })
    } else {
      setManualForm((prev) => ({
        ...prev,
        productCode: code,
      }))
    }
  }

  const handleBulkFileSelected = (file: File) => {
    setUploadedFileName(file.name)
    toast.success(`Selected ${file.name}`)
  }

  const handleDownloadTemplate = () => {
    const csvContent =
      'Product Code,Product Name,Department,Section,Attribute 1,Attribute 2,Attribute 3,Attribute 4,Selling Price,MRP,Quantity\n' +
      'ELE-SAM-A54,Samsung Galaxy A54 5G,Electronics,Mobiles,Graphite,128GB,Glass,Samsung,34999,38999,1\n' +
      'APP-NIK-AM270,Nike Air Max 270,Footwear,Sportswear,White,9 UK,Mesh,Nike,11995,13995,1\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'sample_product_barcode_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Sample template downloaded')
  }

  const handleTemplateModalContinue = () => {
    const selectedTmplObj = LABEL_TEMPLATES.find((t) => t.key === selectedTemplate)
    toast.success(`Selected template: ${selectedTmplObj?.title || 'Standard Label'}`)
    setTemplateModalOpen(false)
  }

  const handleDrawerContinue = () => {
    if (mode === 'manual') {
      if (!manualForm.productCode.trim()) {
        toast.error('Please enter a Product Code')
        return
      }

      const selectedTmplObj = LABEL_TEMPLATES.find((t) => t.key === selectedTemplate)
      const newBarcode: Barcode = {
        id: String(Date.now()),
        barcodeId: `BAR-00${Math.floor(10 + Math.random() * 90)}`,
        productName: manualForm.productName.trim() || 'Samsung Galaxy A54 5G',
        productCode: manualForm.productCode.trim(),
        value: '880' + Math.floor(1000000000 + Math.random() * 9000000000),
        type: selectedTemplate === 'jewelry' || selectedTemplate === 'detailed' ? 'QR' : 'EAN-13',
        format: selectedTemplate === 'jewelry' || selectedTemplate === 'detailed' ? '2D' : '1D',
        batch: 'BCH-2025-001',
        generatedAt: '2025-01-15',
        status: 'Active',
      }

      onAddBarcode?.(newBarcode)
      toast.success(
        `Barcode ${newBarcode.barcodeId} created with ${selectedTmplObj?.title || 'Standard Label'}!`
      )
      onClose()
    } else {
      if (!uploadedFileName) {
        bulkFileInputRef.current?.click()
        return
      }
      setBulkVerificationOpen(true)
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      raw={true}
      className="w-full sm:w-[580px] lg:w-[620px]"
    >
      <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-[#0B3B95]">Create Barcode</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Segmented Control / Tabs */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <div className="flex h-10 items-center rounded-xl bg-slate-100/90 p-1">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`flex h-8 flex-1 items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer ${mode === 'manual'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Create Manually
            </button>
            <button
              type="button"
              onClick={() => setMode('bulk')}
              className={`flex h-8 flex-1 items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer ${mode === 'bulk'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Create in Bulk
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {mode === 'manual' ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  CONFIGURATION
                </span>
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(true)}
                  className="text-xs text-[#155DFC] hover:underline font-medium cursor-pointer"
                >
                  Template: {LABEL_TEMPLATES.find((t) => t.key === selectedTemplate)?.title} (Change)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Code */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Product Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manualForm.productCode}
                    onChange={(e) => handleProductCodeChange(e.target.value)}
                    placeholder="e.g. 13456"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={manualForm.productName}
                    onChange={(e) => setManualForm({ ...manualForm, productName: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={manualForm.department}
                    onChange={(e) => setManualForm({ ...manualForm, department: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Section
                  </label>
                  <input
                    type="text"
                    value={manualForm.section}
                    onChange={(e) => setManualForm({ ...manualForm, section: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Attribute 1 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Attribute 1
                  </label>
                  <input
                    type="text"
                    value={manualForm.attribute1}
                    onChange={(e) => setManualForm({ ...manualForm, attribute1: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Attribute 2 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Attribute 2
                  </label>
                  <input
                    type="text"
                    value={manualForm.attribute2}
                    onChange={(e) => setManualForm({ ...manualForm, attribute2: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Attribute 3 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Attribute 3
                  </label>
                  <input
                    type="text"
                    value={manualForm.attribute3}
                    onChange={(e) => setManualForm({ ...manualForm, attribute3: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Attribute 4 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Attribute 4
                  </label>
                  <input
                    type="text"
                    value={manualForm.attribute4}
                    onChange={(e) => setManualForm({ ...manualForm, attribute4: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Selling Price
                  </label>
                  <input
                    type="text"
                    value={manualForm.sellingPrice}
                    onChange={(e) => setManualForm({ ...manualForm, sellingPrice: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    MRP
                  </label>
                  <input
                    type="text"
                    value={manualForm.mrp}
                    onChange={(e) => setManualForm({ ...manualForm, mrp: e.target.value })}
                    placeholder="Auto Fetch from product code"
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  IMPORT FILE
                </span>
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(true)}
                  className="text-xs text-[#155DFC] hover:underline font-medium cursor-pointer"
                >
                  Template: {LABEL_TEMPLATES.find((t) => t.key === selectedTemplate)?.title} (Change)
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleBulkFileSelected(file)
                }}
                onClick={() => bulkFileInputRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed p-8 text-center flex flex-col items-center justify-center transition cursor-pointer ${isDragging
                  ? 'border-[#155DFC] bg-blue-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                  }`}
              >
                <input
                  type="file"
                  ref={bulkFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleBulkFileSelected(file)
                  }}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />

                {/* Framed document icon */}
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/70 text-[#155DFC]">
                  <FileSpreadsheet size={24} strokeWidth={1.5} />
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  {uploadedFileName ? uploadedFileName : 'Drag & drop product file here'}
                </p>
                <p className="mt-1 mb-4 text-xs text-slate-400">
                  Supports Excel (.xlsx) or CSV formats
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    bulkFileInputRef.current?.click()
                  }}
                  className="rounded-lg bg-[#155DFC] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1447E6] transition cursor-pointer"
                >
                  Browse Files
                </button>
              </div>

              {/* Download sample template link */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#155DFC] hover:underline cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Sample Template (Excel / CSV)</span>
                </button>
              </div>

              {/* Instructions & Validation */}
              <div className="mt-6 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  INSTRUCTIONS &amp; VALIDATION
                </span>
              </div>

              <div className="rounded-xl border border-blue-100 bg-[#F0F5FF]/50 p-4 text-xs">
                <p className="font-semibold text-[#0B3B95] mb-2">Please ensure:</p>
                <ul className="space-y-1.5 text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#155DFC]">•</span>
                    <span>Column headers match our template precisely (Product Name, Product Code, Price).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#155DFC]">•</span>
                    <span>Quantity field defaults to 1 if left empty.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#155DFC]">•</span>
                    <span>Barcodes can be automatically generated for products missing pre-existing codes.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-slate-200 bg-white px-5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDrawerContinue}
            className="h-9 rounded-lg bg-[#155DFC] hover:bg-[#1447E6] px-5 text-xs font-medium text-white transition shadow-xs cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>

      <DataVerificationModal
        isOpen={bulkVerificationOpen}
        onClose={() => setBulkVerificationOpen(false)}
        onContinue={() => {
          setBulkVerificationOpen(false)
          toast.success('242 valid barcodes imported successfully!')
          onClose()
        }}
      />

      <LabelTemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        onContinue={handleTemplateModalContinue}
      />
    </Drawer>
  )
}

/* ---------- Edit Barcode Modal ---------- */

function EditBarcodeModal({
  isOpen,
  onClose,
  barcode,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  barcode: Barcode | null
  onSave: (updated: Barcode) => void
}) {
  const [formData, setFormData] = useState<Partial<Barcode>>({})

  useEffect(() => {
    if (barcode) {
      setFormData(barcode)
    }
  }, [barcode])

  if (!barcode) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...barcode, ...formData } as Barcode)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#0B3B95]">Edit Barcode</h3>
          <p className="mt-0.5 text-xs text-slate-400">Update barcode details and configuration</p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Barcode ID</label>
          <input
            type="text"
            disabled
            value={formData.barcodeId || ''}
            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label>
          <input
            type="text"
            value={formData.productName || ''}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Product Code</label>
          <input
            type="text"
            value={formData.productCode || ''}
            onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
            className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Barcode Value</label>
          <input
            type="text"
            value={formData.value || ''}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-[#155DFC] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Generated Date</label>
            <input
              type="text"
              value={formData.generatedAt || ''}
              onChange={(e) => setFormData({ ...formData, generatedAt: e.target.value })}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Print Batch</label>
            <input
              type="text"
              value={formData.batch || ''}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 rounded-lg bg-[#0B3B95] px-4 text-xs font-medium text-white hover:bg-[#092e74] transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- Page ---------- */

export default function BarcodeTab() {
  const { data: initialBarcodes = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-barcodes'],
    queryFn: inventorySetupService.getBarcodes,
  })
  const { data: stats } = useQuery({
    queryKey: ['inventory-setup-barcode-stats'],
    queryFn: inventorySetupService.getBarcodeStats,
  })

  const [barcodeList, setBarcodeList] = useState<Barcode[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [bulkVerificationOpen, setBulkVerificationOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [editingBarcode, setEditingBarcode] = useState<Barcode | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialBarcodes.length > 0) {
      setBarcodeList(initialBarcodes)
    }
  }, [initialBarcodes])

  // Close row action dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = () => {
    exportToCSV(
      barcodeList,
      [
        { header: 'Barcode ID', accessor: (b) => b.barcodeId },
        { header: 'Product Name', accessor: (b) => b.productName },
        { header: 'Product Code', accessor: (b) => b.productCode },
        { header: 'Barcode Value', accessor: (b) => b.value },
        { header: 'Generated', accessor: (b) => b.generatedAt },
        { header: 'Print Batch', accessor: (b) => b.batch },
      ],
      'barcodes-list.csv'
    )
    toast.success('Exported barcodes to CSV')
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBulkVerificationOpen(true)
      toast.success(`Importing ${file.name}...`)
    }
  }

  const handleEdit = (barcode: Barcode) => {
    setEditingBarcode(barcode)
    setEditModalOpen(true)
  }

  const handleSaveEdit = (updated: Barcode) => {
    setBarcodeList((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
    toast.success(`Barcode ${updated.barcodeId} updated successfully`)
  }

  const handleAddBarcode = (newBarcode: Barcode) => {
    setBarcodeList((prev) => [newBarcode, ...prev])
  }

  const handleDelete = (id: string) => {
    const item = barcodeList.find((b) => b.id === id)
    setBarcodeList((prev) => prev.filter((b) => b.id !== id))
    setSelectedIds((prev) => prev.filter((sid) => sid !== id))
    toast.success(`Barcode ${item?.barcodeId || id} deleted`)
  }

  const filtered = useMemo(
    () =>
      barcodeList.filter(
        (b) =>
          b.productName.toLowerCase().includes(search.toLowerCase()) ||
          b.productCode.toLowerCase().includes(search.toLowerCase()) ||
          b.barcodeId.toLowerCase().includes(search.toLowerCase()) ||
          b.value.includes(search) ||
          b.batch.toLowerCase().includes(search.toLowerCase())
      ),
    [barcodeList, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const displayedBarcodes = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const allVisibleSelected =
    displayedBarcodes.length > 0 && displayedBarcodes.every((b) => selectedIds.includes(b.id))

  const handleToggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = displayedBarcodes.map((b) => b.id)
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)))
    } else {
      const visibleIds = displayedBarcodes.map((b) => b.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const startRecord = filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0
  const endRecord = Math.min(currentPage * pageSize, filtered.length)

  return (
    <div className="space-y-4">
      {/* Hidden file input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />

      {/* Top Header / Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-1">
        {/* Left: Title + Search */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-[#0B3B95]">Barcode Management</h2>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search the Batch..."
              className="h-8.5 w-48 sm:w-56 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Print */}
          <button
            type="button"
            onClick={() => setPrintOpen(true)}
            className="flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Printer size={14} className="text-slate-600" />
            <span>Print</span>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Upload size={14} className="text-slate-600" />
            <span>Export</span>
          </button>

          {/* Import */}
          <button
            type="button"
            onClick={handleImport}
            className="flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Download size={14} className="text-slate-600" />
            <span>Import</span>
          </button>

          {/* + Create Barcode */}
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex h-8.5 items-center gap-1.5 rounded-lg bg-[#0B3B95] hover:bg-[#092e74] px-4 text-xs font-medium text-white shadow-2xs transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Barcode</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs relative">
        <div className="overflow-x-auto min-h-[360px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-white">
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={handleToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-[#155DFC] focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5 text-slate-600 font-semibold text-xs">Barcode ID</th>
                <th className="px-4 py-3.5 text-slate-600 font-semibold text-xs">Product</th>
                <th className="px-4 py-3.5 text-slate-600 font-semibold text-xs">Barcode Value</th>
                <th className="px-4 py-3.5 text-slate-600 font-semibold text-xs">Generated</th>
                <th className="px-4 py-3.5 text-slate-600 font-semibold text-xs">Print batch</th>
                <th className="w-12 px-4 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 size={24} className="mx-auto animate-spin text-[#155DFC] mb-2" />
                    Loading barcodes...
                  </td>
                </tr>
              ) : displayedBarcodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No barcodes found matching your search.
                  </td>
                </tr>
              ) : (
                displayedBarcodes.map((row) => {
                  const isChecked = selectedIds.includes(row.id)
                  const isMenuOpen = activeMenuId === row.id

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Checkbox */}
                      <td className="w-12 px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(row.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#155DFC] focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Barcode ID */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-xs text-[#155DFC]">
                          {row.barcodeId}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5">
                        <div className="py-0.5">
                          <p className="text-sm font-semibold text-slate-900 leading-tight">
                            {row.productName}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {row.productCode}
                          </p>
                        </div>
                      </td>

                      {/* Barcode Value */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-medium text-[#155DFC]">
                          {row.value}
                        </span>
                      </td>

                      {/* Generated */}
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {row.generatedAt}
                      </td>

                      {/* Print batch */}
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {row.batch}
                      </td>

                      {/* Actions Column */}
                      <td className="w-12 px-4 py-3.5 text-right relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMenuId(isMenuOpen ? null : row.id)
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-4 top-10 w-28 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null)
                                handleEdit(row)
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              <Pencil size={13} className="text-slate-500" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null)
                                handleDelete(row.id)
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 size={13} className="text-red-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <div>
            Showing {startRecord}-{endRecord} of {filtered.length} barcodes
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition cursor-pointer ${currentPage === pageNum
                  ? 'bg-[#0B3B95] font-semibold text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Barcode Drawer */}
      <CreateBarcodeDrawer
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setBulkVerificationOpen(false)
        }}
        onAddBarcode={handleAddBarcode}
        bulkVerificationOpen={bulkVerificationOpen}
        setBulkVerificationOpen={setBulkVerificationOpen}
      />

      {/* Print Barcodes Drawer */}
      <PrintBarcodesDrawer
        isOpen={printOpen}
        onClose={() => setPrintOpen(false)}
        totalCount={stats?.total ?? 250}
      />

      {/* Edit Barcode Modal */}
      <EditBarcodeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        barcode={editingBarcode}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
