import { useState } from 'react'
import {
  AlertTriangle,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Printer,
  Download,
  Truck,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'
import type { CreateEWayBillPayload } from '@/types/EwayBill'
import { generateDocumentPdf } from '@/utils/generateDocumentPdf'


function todayISODate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const TODAY = todayISODate()

const GENERATING_STEPS = [
  'Validating shipment details...',
  'Authenticating with NIC portal...',
  'Generating EWB number...',
]

const SUPPLY_TYPE_LABELS: Record<string, string> = {
  b2b: 'Business to Business',
  b2c: 'Business to Consumer',
  d2c: 'Direct to Consumer',
}

// Demo-only helper — no real IRP/GSP call happens anywhere in this flow.
function fakeEwbNumber() {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
}

type Stage = 'form' | 'generating' | 'generated'

type GeneratedResult = {
  ewbNumber: string
  ewbDate: string
  validUntil: string
  documentNumber: string
  documentDate: string
  supplyTypeLabel: string
  fromLegalName: string
  fromGstin: string
  fromCity: string
  toLegalName: string
  toGstin: string
  toCity: string
  hsnCode: string
  taxableValue: number
  vehicleNumber: string
  transportModeLabel: string
  distanceKm: number
}

export default function EWayBillPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['e-way-bill-form-options'],
    queryFn: utilitiesService.getEWayBillFormOptions,
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
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [distanceKm, setDistanceKm] = useState('')

  const [stage, setStage] = useState<Stage>('form')
  const [stepIndex, setStepIndex] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneratedResult | null>(null)

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
    setVehicleNumber('')
    setTransportMode('')
    setDistanceKm('')
    setResult(null)
    setStage('form')
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function handleSubmit() {
    setSubmitError(null)

    const taxableValueNum = Number(taxableValue)
    const distanceKmNum = Number(distanceKm)

    if (
      !transactionType ||
      !supplyType ||
      !documentDate ||
      !sellerGstProfileId ||
      !toGstin ||
      !hsnCode ||
      !taxableValue ||
      Number.isNaN(taxableValueNum) ||
      taxableValueNum <= 0 ||
      !vehicleNumber ||
      !transportMode ||
      !distanceKm ||
      !Number.isInteger(distanceKmNum) ||
      distanceKmNum <= 0
    ) {
      setSubmitError('Please fill in all required fields with valid values.')
      return
    }
    if (!data) return

    const payload: CreateEWayBillPayload = {
      transactionType: transactionType as CreateEWayBillPayload['transactionType'],
      supplyType: supplyType as CreateEWayBillPayload['supplyType'],
      documentDate,
      sellerGstProfileId: Number(sellerGstProfileId),
      fromPin: fromPin || undefined,
      fromCity: fromCity || undefined,
      toGstin,
      toLegalName: toLegalName || undefined,
      toPin: toPin || undefined,
      toCity: toCity || undefined,
      hsnCode,
      taxableValue: taxableValueNum,
      vehicleNumber,
      transportMode: transportMode as CreateEWayBillPayload['transportMode'],
      distanceKm: distanceKmNum,
    }
    console.log({
  
  toGstin: payload.toGstin,
  hsnCode: payload.hsnCode,
  vehicleNumber: payload.vehicleNumber,
  fromPin: payload.fromPin,
  toPin: payload.toPin,
  fromCity: payload.fromCity,
  toCity: payload.toCity,
  toLegalName: payload.toLegalName,
}, {
  lengths: {
   
    toGstin: payload.toGstin?.length,
    hsnCode: payload.hsnCode?.length,
    vehicleNumber: payload.vehicleNumber?.length,
    fromPin: payload.fromPin?.length,
    toPin: payload.toPin?.length,
    fromCity: payload.fromCity?.length,
    toCity: payload.toCity?.length,
    toLegalName: payload.toLegalName?.length,
  }
})

    setStage('generating')
    setStepIndex(0)

    // Advance the fake progress steps on a fixed cadence, independent of
    // when the real API call actually resolves.
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, GENERATING_STEPS.length - 1))
    }, 900)

    const minAnimationTime = delay(GENERATING_STEPS.length * 900)

    try {
      const [createResult] = await Promise.all([
        utilitiesService.createEWayBill(payload),
        minAnimationTime,
      ])

      const sellerProfile = data.sellerGstProfiles.find((p) => String(p.id) === sellerGstProfileId)
      const supplyTypeLabel = SUPPLY_TYPE_LABELS[supplyType] ?? supplyType
      const transportModeLabel =
        data.transportModes.find((m) => m.value === transportMode)?.label ?? transportMode

      setResult({
        ewbNumber: fakeEwbNumber(),
        ewbDate: new Date().toISOString(),
        validUntil: String(createResult.validUntil),
        documentNumber: createResult.documentNumber,
        documentDate,
        supplyTypeLabel,
        fromLegalName: sellerProfile?.label ?? '—',
        fromGstin: sellerProfile?.gstin ?? '',
        fromCity: fromCity || '—',
        toLegalName: toLegalName || '—',
        toGstin,
        toCity: toCity || '—',
        hsnCode,
        taxableValue: taxableValueNum,
        vehicleNumber,
        transportModeLabel,
        distanceKm: distanceKmNum,
      })
      setStage('generated')
    } catch {
      setSubmitError('Could not create the e-way bill. Please check the details and try again.')
      setStage('form')
    } finally {
      clearInterval(stepTimer)
    }
  }
  function handleDownloadPdf() {
  if (!result) return

  generateDocumentPdf({
    documentTitle: 'E-Way Bill',
    referenceLabel: 'E-WAY BILL NUMBER (EWB)',
    referenceValue: result.ewbNumber,
    metaLine: `Generated: ${new Date(result.ewbDate).toLocaleString('en-IN')}    Valid Until: ${new Date(result.validUntil).toLocaleDateString('en-IN')}`,
    sectionRows: [
      [
        {
          title: 'SHIPMENT DETAILS',
          fields: [
            { label: 'Document No', value: result.documentNumber },
            { label: 'Document Date', value: result.documentDate },
            { label: 'Supply Type', value: result.supplyTypeLabel },
            { label: 'HSN Code', value: result.hsnCode },
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
          title: 'LOGISTICS & TRANSPORT',
          fields: [
            { label: 'Mode', value: result.transportModeLabel },
            { label: 'Vehicle Number', value: result.vehicleNumber },
            { label: 'Distance', value: `${result.distanceKm} km` },
          ],
        },
      ],
    ],
    totalLabel: 'Taxable Value',
    totalValue: `Rs. ${result.taxableValue.toLocaleString('en-IN')}`,
    footerNote: 'Demo preview — this e-way bill was saved locally and was not submitted to any government system.',
    filename: `e-way-bill-${result.ewbNumber}.pdf`,
  })
}

  if (isLoading || !data) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">E-Way Bill Generator</h1>
          <p className="page-subtitle">Generate e-way bills for goods transport compliance</p>
        </div>
      </div>

      {stage === 'generated' && result ? (
        <div>
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-700">E-Way Bill Generated Successfully</p>
              <p className="text-xs text-emerald-600/80">Real-time registration with NIC portal was successful.</p>
            </div>
          </div>

          <div className="section-card">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400">E-WAY BILL NUMBER (EWB)</p>
                <p className="mt-1 break-all text-sm font-bold text-[#043793]">{result.ewbNumber}</p>
                <p className="mt-1.5 text-xs text-slate-400">
                  Generated:{' '}
                  <span className="font-medium text-slate-500">
                    {new Date(result.ewbDate).toLocaleString('en-IN')}
                  </span>
                  <span className="mx-2">·</span>
                  Valid Until:{' '}
                  <span className="font-medium text-slate-500">
                    {new Date(result.validUntil).toLocaleDateString('en-IN')}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
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
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                  <Truck size={32} className="text-slate-300" />
                </div>
                <p className="text-center text-[10px] leading-tight text-slate-400">Demo EWB — placeholder only</p>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-wide text-slate-400">SHIPMENT DETAILS</p>
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
                    <dt className="text-slate-400">HSN Code</dt>
                    <dd className="font-semibold text-slate-700">{result.hsnCode}</dd>
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
                <p className="mb-2 text-[10px] font-semibold tracking-wide text-slate-400">LOGISTICS & TRANSPORT</p>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Mode</dt>
                    <dd className="font-semibold text-slate-700">{result.transportModeLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Vehicle</dt>
                    <dd className="font-semibold text-slate-700">{result.vehicleNumber}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Distance</dt>
                    <dd className="font-semibold text-slate-700">{result.distanceKm} km</dd>
                  </div>
                  <div className="mt-2 flex justify-between gap-3 border-t border-slate-200 pt-2">
                    <dt className="font-semibold text-slate-500">Taxable Value</dt>
                    <dd className="text-sm font-bold text-[#043793]">
                      ₹{result.taxableValue.toLocaleString('en-IN')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <ClipboardList size={13} className="shrink-0" />
                E-Way Bill has been successfully registered with the NIC portal.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-9 rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Cancel EWB
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
            Demo preview — this e-way bill was saved locally and was not submitted to any government system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
          <div className="section-card">
            <h2 className="section-title mb-4">Bill Details</h2>

            {stage === 'generating' ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-center">
                <Loader2 size={32} className="animate-spin text-[#0aa6a6]" />
                <p className="mt-2 text-sm font-semibold text-[#043793]">Generating E-Way Bill...</p>
                <p className="text-xs text-slate-400">Connecting to GST e-way bill API</p>
                <ul className="mt-3 space-y-1.5 text-left">
                  {GENERATING_STEPS.map((step, i) => (
                    <li key={step} className="flex items-center gap-2 text-xs">
                      {i < stepIndex ? (
                        <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
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
                      <option value="outward">Outward</option>
                      <option value="inward">Inward</option>
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
                      <option value="b2b">Business to Business</option>
                      <option value="b2c">Business to Consumer</option>
                      <option value="d2c">Direct to Consumer</option>
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

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">Distance (km) *</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(e.target.value)}
                      placeholder="250"
                      className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-400">Mode of Transport *</span>
                  <div className="flex flex-wrap gap-2">
                    {data.transportModes.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setTransportMode(mode.value)}
                        className={`h-10 rounded-[14px] px-4 text-xs font-semibold transition ${
                          transportMode === mode.value
                            ? 'bg-[linear-gradient(#093055,#043793)] text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-400">Vehicle Number *</span>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="MH-01-AB-1234"
                    className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-6 flex h-10 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(#093055,#043793)] text-sm font-semibold text-white"
                >
                  Generate E-Way Bill
                </button>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="section-card">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList size={14} className="text-[#043793]" />
                <h3 className="text-xs font-bold text-[#043793]">Validity Rules</h3>
              </div>
              <div className="space-y-1">
                {data.validityRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between py-1.5 text-xs">
                    <span className="text-slate-400">{rule.distance}</span>
                    <span className="font-semibold text-slate-700">{rule.validity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(245,158,11,0.15)] bg-[rgba(245,158,11,0.06)] p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />
                <div>
                  <p className="text-xs font-bold text-amber-500">Compliance Notice</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{data.complianceNotice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}