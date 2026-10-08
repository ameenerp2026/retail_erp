import { useMemo, useState } from 'react'
import {
  Barcode as BarcodeIcon,
  Check,
  CheckCircle2,
  Loader2,
  Plus,
  QrCode,
  ScanBarcode,
  Sparkles,
  X,
} from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import ReusableTable from '@/components/shared/ReusableTable'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { Barcode, BarcodeLabelTemplate, DataVerificationRow } from '@/types/inventorySetup'
import { DATA_VERIFICATION_MOCK } from '@/mocks/inventorySetup.mock'
import TabToolbar, { GhostButton, PrimaryButton } from '../shared/TabToolbar'
import ModulePill from '../shared/ModulePill'
import { Modal } from '@/components/shared/Modal'
import {
  FieldWrap,
  SelectInput,
  TextInput,
  DrawerFooter,
} from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'

/* ---------- Label templates (design-27) ---------- */

const LABEL_TEMPLATES: BarcodeLabelTemplate[] = [
  { key: 'standard', title: 'Standard Label', description: 'Includes product name, MRP, selling price, and a standard EAN barcode.' },
  { key: 'company', title: 'Label with Company Details', description: 'Includes retail company name, support details, and custom logo on top.' },
  { key: 'garment', title: 'Garment Label Sticker', description: 'Perfect for fashion/clothing. Shows size (S/M/L/XL), color and price.' },
  { key: 'jewelry', title: 'Jewelry Label Sticker', description: 'Ultra-narrow dumbbell template containing catalog style code and MRP.' },
  { key: 'detailed', title: 'Detailed Product Label', description: 'Ideal for shipping and cartons. Shows warehouse row, batch, and weight.' },
  { key: 'priceTag', title: 'Price Tag Label', description: 'Highlights a large discounted sale price on a highly visible layout.' },
]/* ---------- Bulk: data verification modal (design-29) ---------- */

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
                className={`border-t border-slate-50 ${
                  r.status === 'Missing Code' ? 'bg-[#FFFBEB]' : r.status === 'Duplicate' ? 'bg-[#FEF2F2]' : ''
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

/* ---------- Progress step (design-28) ---------- */

function ProgressStep({ progress }: { progress: number }) {
  const steps = [
    { label: 'File Read', done: true },
    { label: 'Data Validated', done: true },
    { label: 'Rendering Barcodes...', done: false },
  ]
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#155DFC"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 276.5} 276.5`}
          />
        </svg>
        <span className="text-lg font-bold text-[#155DFC]">{progress}%</span>
      </div>

      <div className="text-center">
        <p className="text-base font-bold text-[#043793]">Generating Barcodes...</p>
        <p className="mt-1 text-xs text-slate-400">Processing 142 of 250 records</p>
        <p className="mt-0.5 text-[11px] text-slate-400">Estimated time remaining: 15 seconds</p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
        {steps.map((s, i) => (
          <span key={s.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-slate-300">›</span>}
            <span className={`flex items-center gap-1 text-[11px] font-medium ${s.done ? 'text-[#009966]' : 'text-[#155DFC]'}`}>
              {s.done && <Check size={11} />}
              {s.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Success step (design-28/31) ---------- */

function SuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5]">
        <CheckCircle2 size={30} className="text-[#009966]" />
      </span>

      <div className="text-center">
        <p className="text-lg font-bold text-[#043793]">Barcodes Generated Successfully!</p>
        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-400">
          250 barcodes have been formatted, generated, and are ready for download or local physical printing.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-3">
        {[
          { k: 'Total Generated', v: '250 Labels' },
          { k: 'Barcode Type', v: 'Standard Label (40×25mm)' },
          { k: 'Format Destination', v: 'Print Spooler PDF' },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between border-b border-slate-50 py-1.5 last:border-b-0">
            <span className="text-xs text-slate-400">{r.k}</span>
            <span className="text-xs font-semibold text-[#314158]">{r.v}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg bg-[#155DFC] px-5 text-sm font-medium text-white hover:bg-[#1447E6]"
        >
          <ScanBarcode size={14} /> Print All Barcodes
        </button>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-5 text-sm font-medium text-[#314158] hover:bg-slate-50"
        >
          Download as PDF
        </button>
      </div>

      <div className="w-full pt-6">
        <DrawerFooter cancelLabel="Close" onCancel={onClose} primaryLabel="Done" onPrimary={onClose} />
      </div>
    </div>
  )
}

/* ---------- Main drawer ---------- */

type FlowStep = 'form' | 'progress' | 'success'

function GenerateBarcodeDrawer({
  isOpen,
  onClose,
  bulkVerificationOpen,
  setBulkVerificationOpen,
}: {
  isOpen: boolean
  onClose: () => void
  bulkVerificationOpen: boolean
  setBulkVerificationOpen: (v: boolean) => void
}) {
  const [mode, setMode] = useState<'manual' | 'bulk'>('manual')
  const [template, setTemplate] = useState<string | null>('standard')
  const [step, setStep] = useState<FlowStep>('form')
  const [progress, setProgress] = useState(56)

  const startGenerate = () => {
    setStep('progress')
    setProgress(56)
    // simulate progress → success
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setStep('success')
          return 100
        }
        return p + 4
      })
    }, 120)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <h3 className="text-lg font-bold text-[#043793]">Generate Barcode</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      {step === 'form' && (
        <>
          {/* mode toggle */}
          <div className="px-6 pb-4">
            <div className="flex h-10 items-center rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex h-8 flex-1 items-center justify-center rounded-lg text-sm font-medium transition ${
                  mode === 'manual' ? 'bg-white text-[#043793] shadow-sm' : 'text-slate-500'
                }`}
              >
                Generate Manually
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={`flex h-8 flex-1 items-center justify-center rounded-lg text-sm font-medium transition ${
                  mode === 'bulk' ? 'bg-white text-[#043793] shadow-sm' : 'text-slate-500'
                }`}
              >
                Generate in Bulk
              </button>
            </div>
          </div>

          <div className="max-h-[62vh] overflow-y-auto px-6 pb-2">
            {mode === 'manual' ? (
              <>
                <div className="mb-4">
                  <SectionLabel>Configuration</SectionLabel>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldWrap label="Product Name"><TextInput placeholder="e.g. Samsung Galaxy A54 5G" /></FieldWrap>
                  <FieldWrap label="Product Code"><TextInput placeholder="e.g. 13456" /></FieldWrap>
                  <FieldWrap label="Department"><SelectInput options={['Electronics', 'Apparel', 'FMCG']} placeholder="Select Department" /></FieldWrap>
                  <FieldWrap label="Section"><SelectInput options={['Mobiles', 'Audio', 'Clothing']} placeholder="Select Section" /></FieldWrap>
                  <FieldWrap label="Attribute 1"><SelectInput options={['Black', 'White', 'Blue']} placeholder="Select Color" /></FieldWrap>
                  <FieldWrap label="Attribute 2"><SelectInput options={['S', 'M', 'L', 'XL']} placeholder="Select Size" /></FieldWrap>
                  <FieldWrap label="Attribute 3"><SelectInput options={['Cotton', 'Leather', 'Plastic']} placeholder="Select Material" /></FieldWrap>
                  <FieldWrap label="Attribute 4"><SelectInput options={['Samsung', 'Nike', 'Apple']} placeholder="Select Brand" /></FieldWrap>
                  <FieldWrap label="Quantity"><SelectInput options={['1', '2', '5', '10']} placeholder="1" /></FieldWrap>
                  <FieldWrap label="MRP"><TextInput placeholder="e.g. 19.99" /></FieldWrap>
                  <FieldWrap label="Selling Price"><TextInput placeholder="e.g. 14.99" /></FieldWrap>
                </div>

                <div className="mt-6">
                  <SectionLabel>Barcode Preview</SectionLabel>
                  <div className="mt-3 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50">
                    <BarcodeIcon size={64} strokeWidth={1.2} className="text-[#043793]" />
                    <span className="font-mono text-xs tracking-[0.3em] text-slate-500">8 901234 567890</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldWrap label="Print Template">
                    <SelectInput options={LABEL_TEMPLATES.map((t) => t.title)} placeholder="Standard Label (40×25mm)" />
                  </FieldWrap>
                  <FieldWrap label="Number of Labels"><TextInput placeholder="1" /></FieldWrap>
                </div>

                <div className="mt-6">
                  <SectionLabel>Choose Label Template</SectionLabel>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {LABEL_TEMPLATES.map((t) => {
                      const selected = template === t.key
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTemplate(t.key)}
                          className={`rounded-xl border p-3 text-left transition ${
                            selected ? 'border-[#155DFC] bg-[#EFF6FF]' : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-[#043793]">{t.title}</span>
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                selected ? 'border-[#155DFC] bg-[#155DFC]' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {selected && <Check size={10} className="text-white" />}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{t.description}</p>
                          <div className="mt-2 flex h-14 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                            {t.key === 'jewelry' ? (
                              <span className="h-1.5 w-28 rounded-full bg-slate-300" />
                            ) : t.key === 'priceTag' ? (
                              <span className="rounded bg-[#FEF2F2] px-2 py-1 text-xs font-bold text-[#C10007]">SALE! ₹49.99</span>
                            ) : (
                              <BarcodeIcon size={28} className="text-slate-400" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* bulk upload placeholder panel */
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">
                <Sparkles size={20} className="text-[#155DFC]" />
                <p className="text-sm font-medium text-[#314158]">Upload CSV / Excel file</p>
                <p className="max-w-xs text-xs text-slate-400">
                  Drop a file with product rows (name, code, MRP). The system validates each row before generating barcodes.
                </p>
                <button
                  type="button"
                  onClick={() => setBulkVerificationOpen(true)}
                  className="mt-1 flex h-9 items-center gap-2 rounded-lg bg-[#155DFC] px-4 text-sm font-medium text-white hover:bg-[#1447E6]"
                >
                  <Plus size={14} /> Upload &amp; Verify
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-6 py-4">
            <DrawerFooter
              onCancel={onClose}
              primaryLabel="Generate"
              primaryIcon={<ScanBarcode size={14} />}
              onPrimary={startGenerate}
            />
          </div>
        </>
      )}

      {step === 'progress' && <ProgressStep progress={progress} />}
      {step === 'success' && <SuccessStep onClose={onClose} />}
      <DataVerificationModal
        isOpen={bulkVerificationOpen}
        onClose={() => setBulkVerificationOpen(false)}
        onContinue={() => {
          setBulkVerificationOpen(false)
          startGenerate()
        }}
      />
      <Loader2 size={0} className="hidden" />
      <QrCode size={0} className="hidden" />
    </Modal>
  )
}

/* ---------- Page ---------- */

export default function BarcodeTab() {
  const { data: barcodes = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-barcodes'],
    queryFn: inventorySetupService.getBarcodes,
  })
  const { data: stats } = useQuery({
    queryKey: ['inventory-setup-barcode-stats'],
    queryFn: inventorySetupService.getBarcodeStats,
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [bulkVerificationOpen, setBulkVerificationOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      barcodes.filter(
        (b) =>
          b.productName.toLowerCase().includes(search.toLowerCase()) ||
          b.barcodeId.toLowerCase().includes(search.toLowerCase()) ||
          b.value.includes(search)
      ),
    [barcodes, search]
  )

  const columns: ColumnsType<Barcode> = [
    {
      title: '',
      key: 'select',
      width: 40,
      render: () => <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />,
    },
    {
      title: 'Barcode ID',
      dataIndex: 'barcodeId',
      width: 110,
      render: (v: string) => <span className="font-mono text-xs font-semibold text-[#155DFC]">{v}</span>,
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      width: 210,
      render: (v: string, record: Barcode) => (
        <div>
          <p className="text-sm font-medium text-[#314158]">{v}</p>
          <p className="font-mono text-[10px] text-slate-400">{record.productCode}</p>
        </div>
      ),
    },
    {
      title: 'Barcode Value',
      dataIndex: 'value',
      width: 190,
      render: (v: string) => <span className="font-mono text-xs text-[#314158]">{v}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
      render: (v: Barcode['type']) => <ModulePill label={v} variant="blue" />,
    },
    {
      title: 'Format',
      dataIndex: 'format',
      width: 80,
      render: (v: Barcode['format']) => <span className="text-xs text-slate-500">{v}</span>,
    },
    { title: 'Batch', dataIndex: 'batch', width: 130 },
    { title: 'Generated', dataIndex: 'generatedAt', width: 150 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 95,
      render: (v: Barcode['status']) => <ModulePill label={v} variant="green" />,
    },
  ]

  return (
    <div>
      <TabToolbar
        title="Barcode Management"
        count={filtered.length}
        onSearch={setSearch}
        actions={
          <>
            <GhostButton label="Filters" />
            <GhostButton label="Print Labels" />
            <GhostButton label="Export" />
            <GhostButton label="Import" />
            <PrimaryButton icon={<Plus size={14} />} label="Generate Barcode" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      {/* Stat cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Barcodes', value: stats?.total ?? 0, icon: <BarcodeIcon size={16} className="text-[#155DFC]" />, bg: 'bg-[#EFF6FF]' },
          { label: 'EAN-13 Barcodes', value: stats?.ean13 ?? 0, icon: <QrCode size={16} className="text-[#009966]" />, bg: 'bg-[#ECFDF5]' },
          { label: 'QR Codes', value: stats?.qr ?? 0, icon: <ScanBarcode size={16} className="text-[#6D28D9]" />, bg: 'bg-[#F5F3FF]' },
          { label: 'Unassigned', value: stats?.unassigned ?? 0, icon: <Sparkles size={16} className="text-[#E17100]" />, bg: 'bg-[#FFFBEB]' },
        ].map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${c.bg}`}>{c.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{c.label}</p>
              <p className="text-lg font-bold text-[#314158]">{c.value.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Batch generate strip */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#155DFC]" />
          <p className="text-sm font-semibold text-[#043793]">Batch Generate Barcodes</p>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {stats?.batchCount ?? 6} barcodes generated · Batch {stats?.lastBatch ?? 'BCH-2025-001'}
        </p>
        <div className="mt-3 h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs leading-9 text-slate-400">
          Select Category / Filter
        </div>
      </div>

      <ReusableTable columns={columns} data={filtered} loading={isLoading} rowKey="id" />

      <GenerateBarcodeDrawer
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setBulkVerificationOpen(false)
        }}
        bulkVerificationOpen={bulkVerificationOpen}
        setBulkVerificationOpen={setBulkVerificationOpen}
      />
    </div>
  )
}
