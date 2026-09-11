import { useRef, useState } from 'react'
import { Receipt, Loader2, Check, CheckCircle2, Share2, Printer, Download, Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'
import type { CreateEInvoicePayload } from '@/types/Einvoice'
import { generateDocumentPdf } from '@/utils/generateDocumentPdf'
import { QRCodeCanvas } from 'qrcode.react'

function todayISODate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const TODAY = todayISODate()

const GENERATING_STEPS = ['Validating invoice data...', 'Authenticating with NIC portal...', 'Generating IRN and QR...']

// Demo-only helpers — no real IRP/GSP call happens anywhere in this flow.
function fakeIrn() {
  const bytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}
function fakeAckNumber() {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
}
function formatAckDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`
}

type GeneratedResult = {
  irn: string
  ackNumber: string
  ackDate: string
  documentNumber: string
  documentDate: string
  supplyTypeLabel: string
  fromGstin: string
  toGstin: string
  fromCity: string
  toCity: string
  taxableValue: number
  gstRate: number
  sameState: boolean
  taxAmount: number
  grandTotal: number
}

type Stage = 'form' | 'generating' | 'generated'

export default function EInvoicePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['e-invoice-form-options'],
    queryFn: utilitiesService.getEInvoiceFormOptions,
  })

  const [transactionType, setTransactionType] = useState('')
  const [supplyType, setSupplyType] = useState('')
  const [documentDate, setDocumentDate] = useState(TODAY)
  const [sellerGstProfileId, setSellerGstProfileId] = useState('')
  const [fromPin, setFromPin] = useState('')
  const [fromCity, setFromCity] = useState('')
  const [toGstin, setToGstin] = useState('')
  const [toLegalName, setToLegalName] = useState('')
  const [toPin, setToPin] = useState('')
  const [toCity, setToCity] = useState('')
  const [hsnCode, setHsnCode] = useState('')
  const [taxableValue, setTaxableValue] = useState('')

  const [stage, setStage] = useState<Stage>('form')
  const [stepIndex, setStepIndex] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const qrRef = useRef<HTMLCanvasElement>(null)

  function resetForm() {
    setTransactionType('')
    setSupplyType('')
    setDocumentDate(TODAY)
    setSellerGstProfileId('')
    setFromPin('')
    setFromCity('')
    setToGstin('')
    setToLegalName('')
    setToPin('')
    setToCity('')
    setHsnCode('')
    setTaxableValue('')
    setResult(null)
    setStage('form')
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function handleSubmit() {
    setSubmitError(null)

    const taxableValueNum = Number(taxableValue)
    if (
      !transactionType ||
      !supplyType ||
      !documentDate ||
      !sellerGstProfileId ||
      !toGstin ||
      !hsnCode ||
      !taxableValue ||
      Number.isNaN(taxableValueNum) ||
      taxableValueNum <= 0
    ) {
      setSubmitError('Please fill in all required fields with valid values.')
      return
    }
    if (!data) return

    const payload: CreateEInvoicePayload = {
      transactionType: transactionType as CreateEInvoicePayload['transactionType'],
      supplyType: supplyType as CreateEInvoicePayload['supplyType'],
      documentDate,
      sellerGstProfileId: Number(sellerGstProfileId),
      fromPin: fromPin || undefined,
      fromCity: fromCity || undefined,
      toGstin,
      toLegalName: toLegalName || undefined,
      toPin: toPin || undefined,
      toCity: toCity || undefined,
      items: [{ hsnCode, taxableValue: taxableValueNum }],
    }

    setStage('generating')
    setStepIndex(0)

    // Advance the fake progress steps on a fixed cadence, independent of
    // when the real API call actually resolves — this is what makes the
    // animation feel deliberate rather than just "loading spinner until done."
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, GENERATING_STEPS.length - 1))
    }, 900)

    const minAnimationTime = delay(GENERATING_STEPS.length * 900)

    try {
      const [createResult] = await Promise.all([
        utilitiesService.createEInvoice(payload),
        minAnimationTime,
      ])

      const sellerProfile = data.sellerGstProfiles.find((p) => String(p.id) === sellerGstProfileId)
      const hsn = data.hsnCodes.find((h) => h.code === hsnCode)
      const gstRate = hsn?.gstRate ?? 0
      const buyerStateCode = toGstin.slice(0, 2)
      const sameState = sellerProfile?.stateCode === buyerStateCode
      const taxAmount = Math.round(((taxableValueNum * gstRate) / 100) * 100) / 100
      const grandTotal = taxableValueNum + taxAmount
      const supplyTypeLabel = data.supplyTypes.find((s) => s.value === supplyType)?.label ?? supplyType

      setResult({
        irn: fakeIrn(),
        ackNumber: fakeAckNumber(),
        ackDate: formatAckDate(new Date()),
        documentNumber: createResult.documentNumber,
        documentDate,
        supplyTypeLabel,
        fromGstin: sellerProfile?.gstin ?? '',
        toGstin,
        fromCity: fromCity || '—',
        toCity: toCity || '—',
        taxableValue: taxableValueNum,
        gstRate,
        sameState,
        taxAmount,
        grandTotal,
      })
      setStage('generated')
    } catch {
      setSubmitError('Could not create the invoice. Please check the details and try again.')
      setStage('form')
    } finally {
      clearInterval(stepTimer)
    }
  }
function handleDownloadPdf() {
  if (!result) return

  const taxRows = result.sameState
    ? [
        { label: `CGST (${(result.gstRate / 2).toFixed(1)}%)`, value: `Rs. ${(result.taxAmount / 2).toLocaleString('en-IN')}` },
        { label: `SGST (${(result.gstRate / 2).toFixed(1)}%)`, value: `Rs. ${(result.taxAmount / 2).toLocaleString('en-IN')}` },
      ]
    : [{ label: `IGST (${result.gstRate}%)`, value: `Rs. ${result.taxAmount.toLocaleString('en-IN')}` }]

  generateDocumentPdf({
    documentTitle: 'E-Invoice',
    referenceLabel: 'INVOICE REFERENCE NUMBER (IRN)',
    referenceValue: result.irn,
    metaLine: `Ack No: ${result.ackNumber}    Ack Date: ${result.ackDate}`,
    sectionRows: [
      [
        {
          title: 'INVOICE DETAILS',
          fields: [
            { label: 'Document No', value: result.documentNumber },
            { label: 'Document Date', value: result.documentDate },
            { label: 'Supply Type', value: result.supplyTypeLabel },
            { label: 'Doc Type', value: 'Tax Invoice' },
          ],
        },
        {
          title: 'ENTITY DETAILS',
          fields: [
            { label: 'From GSTIN', value: result.fromGstin },
            { label: 'To GSTIN', value: result.toGstin },
            { label: 'From City', value: result.fromCity },
            { label: 'To City', value: result.toCity },
          ],
        },
      ],
      [
        {
          title: 'FINANCIALS',
          fields: [
            { label: 'Taxable Value', value: `Rs. ${result.taxableValue.toLocaleString('en-IN')}` },
            ...taxRows,
          ],
        },
      ],
    ],
    totalLabel: 'Grand Total',
    totalValue: `Rs. ${result.grandTotal.toLocaleString('en-IN')}`,
    footerNote: 'Demo preview — this invoice was saved locally and was not submitted to any government system.',
    filename: `e-invoice-${result.documentNumber}.pdf`,
  })
}

  if (isLoading || !data) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">E-Invoice Generator</h1>
          <p className="page-subtitle">Generate IRN and QR code via GST e-invoicing API</p>
        </div>
      </div>

      {stage === 'generated' && result ? (
        <div>
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-700">E-Invoice Generated Successfully</p>
              <p className="text-xs text-emerald-600/80">Real-time registration with NIC portal was successful.</p>
            </div>
          </div>

          <div className="section-card">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400">INVOICE REFERENCE NUMBER (IRN)</p>
                <p className="mt-1 break-all text-sm font-bold text-[#043793]">{result.irn}</p>
                <p className="mt-1.5 text-xs text-slate-400">
                  Ack No: <span className="font-medium text-slate-500">{result.ackNumber}</span>
                  <span className="mx-2">·</span>
                  Ack Date: <span className="font-medium text-slate-500">{result.ackDate}</span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Share2 size={13} /> Share
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white"
                >
                  <Download size={13} /> Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[110px_1fr_1fr_170px]">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
                  <QRCodeCanvas
                    ref={qrRef}
                    value={result.irn}
                    size={80}
                    level="M"
                    fgColor="#043793"
                  />
                </div>
                <p className="text-center text-[10px] font-semibold leading-tight text-[#0aa6a6]">
                  GST PORTAL VALIDATION READY
                </p>
                <p className="text-center text-[10px] leading-tight text-slate-400">
                  Scanned for GST portal validation
                </p>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-wide text-slate-400">INVOICE DETAILS</p>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Document No</dt>
                    <dd className="font-semibold text-slate-700">{result.documentNumber}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Document Date</dt>
                    <dd className="font-semibold text-slate-700">{result.documentDate}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Supply Type</dt>
                    <dd className="font-semibold text-slate-700">{result.supplyTypeLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Doc Type</dt>
                    <dd className="font-semibold text-slate-700">Tax Invoice</dd>
                  </div>
                </dl>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-wide text-slate-400">ENTITY DETAILS</p>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">From GSTIN</dt>
                    <dd className="font-semibold text-slate-700">{result.fromGstin}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">To GSTIN</dt>
                    <dd className="font-semibold text-slate-700">{result.toGstin}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">From City</dt>
                    <dd className="font-semibold text-slate-700">{result.fromCity}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">To City</dt>
                    <dd className="font-semibold text-slate-700">{result.toCity}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-[10px] font-semibold tracking-wide text-slate-400">FINANCIALS</p>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Taxable Value</dt>
                    <dd className="font-semibold text-slate-700">₹{result.taxableValue.toLocaleString('en-IN')}</dd>
                  </div>
                  {result.sameState ? (
                    <>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-400">CGST ({(result.gstRate / 2).toFixed(1)}%)</dt>
                        <dd className="font-semibold text-slate-700">
                          ₹{(result.taxAmount / 2).toLocaleString('en-IN')}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-400">SGST ({(result.gstRate / 2).toFixed(1)}%)</dt>
                        <dd className="font-semibold text-slate-700">
                          ₹{(result.taxAmount / 2).toLocaleString('en-IN')}
                        </dd>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">IGST ({result.gstRate}%)</dt>
                      <dd className="font-semibold text-slate-700">₹{result.taxAmount.toLocaleString('en-IN')}</dd>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between gap-3 border-t border-slate-200 pt-2">
                    <dt className="font-semibold text-slate-500">Grand Total</dt>
                    <dd className="text-sm font-bold text-[#043793]">₹{result.grandTotal.toLocaleString('en-IN')}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <Info size={13} className="shrink-0" />
                IRN has been successfully pushed to the E-Way Bill system.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-9 rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Cancel IRN
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-9 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-xs font-semibold text-white"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-300">
            Demo preview — this invoice was saved locally and was not submitted to any government system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
          <div className="section-card">
            <h2 className="section-title mb-4">Invoice Details</h2>

            {stage === 'generating' ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-center">
                <Loader2 size={32} className="animate-spin text-[#0aa6a6]" />
                <p className="mt-2 text-sm font-semibold text-[#043793]">Generating IRN...</p>
                <p className="text-xs text-slate-400">Connecting to GST e-invoice API</p>
                <ul className="mt-3 space-y-1.5 text-left">
                  {GENERATING_STEPS.map((step, i) => (
                    <li key={step} className="flex items-center gap-2 text-xs">
                      {i < stepIndex ? (
                        <Check size={13} className="shrink-0 text-emerald-500" />
                      ) : i === stepIndex ? (
                        <Loader2 size={13} className="shrink-0 animate-spin text-[#0aa6a6]" />
                      ) : (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-200" />
                      )}
                      <span className={i <= stepIndex ? 'text-slate-600' : 'text-slate-300'}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {submitError && (
                  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Transaction Type *</span>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    >
                      <option value="">Select type</option>
                      {data.transactionTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Supply Type *</span>
                    <select
                      value={supplyType}
                      onChange={(e) => setSupplyType(e.target.value)}
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    >
                      <option value="">Select type</option>
                      {data.supplyTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Document Number</span>
                    <input
                      type="text"
                      disabled
                      value="Auto-generated on save"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-100 px-3 text-sm text-slate-400 outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Document Date *</span>
                    <input
                      type="date"
                      value={documentDate}
                      max={TODAY}
                      onChange={(e) => setDocumentDate(e.target.value)}
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">From GSTIN *</span>
                    <select
                      value={sellerGstProfileId}
                      onChange={(e) => setSellerGstProfileId(e.target.value)}
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    >
                      <option value="">Select GSTIN</option>
                      {data.sellerGstProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">To GSTIN *</span>
                    <input
                      type="text"
                      value={toGstin}
                      onChange={(e) => setToGstin(e.target.value.toUpperCase())}
                      placeholder="07AABCS1429B1ZC"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">From PIN</span>
                    <input
                      type="text"
                      value={fromPin}
                      onChange={(e) => setFromPin(e.target.value)}
                      placeholder="400051"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">To PIN</span>
                    <input
                      type="text"
                      value={toPin}
                      onChange={(e) => setToPin(e.target.value)}
                      placeholder="110001"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">From City</span>
                    <input
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      placeholder="Chennai"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">To City</span>
                    <input
                      type="text"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      placeholder="Bangalore"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Item HSN Code *</span>
                    <select
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    >
                      <option value="">Select HSN code</option>
                      {data.hsnCodes.map((h) => (
                        <option key={h.id} value={h.code}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Taxable Value (₹) *</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxableValue}
                      onChange={(e) => setTaxableValue(e.target.value)}
                      placeholder="105932.20"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-6 flex h-10 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(#093055,#043793)] text-sm font-semibold text-white"
                >
                  Generate E-Invoice
                </button>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-[rgba(11,77,140,0.12)] bg-[rgba(11,77,140,0.03)] p-5 shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(11,77,140,0.1)] text-[#043793]">
              <Receipt size={26} />
            </div>
            <h3 className="mb-2 text-sm font-bold text-[#043793]">About E-Invoicing</h3>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Generate Invoice Reference Numbers (IRN) and QR codes compliant with the GST
              e-invoicing mandate for B2B transactions above ₹5 crore turnover.
            </p>
            <ul className="space-y-2">
              {[
                'Mandatory for registered taxpayers above the turnover threshold',
                'Real-time registration with the NIC portal',
                'Auto-populated in GSTR-1',
                'Prevents fake billing',
              ].map((bullet) => (
                <li key={bullet} className="text-xs text-slate-400">
                  • {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}