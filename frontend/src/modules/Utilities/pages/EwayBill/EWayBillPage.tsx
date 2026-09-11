import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'
import type { CreateEWayBillPayload } from '@/types/EwayBill'
import DocumentGeneratingView from '../../components/Documents/DocumentGeneratingView'
import EWayBillForm from './EWayBillForm'
import EWayBillResult from './EWayBillResult'
import EWayBillAbout from './EWayBillAbout'
import type { EWayBillFormField, EWayBillFormState, EWayBillGeneratedResult } from './EWayBillGeneration.types'

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

const EMPTY_FORM: EWayBillFormState = {
  transactionType: '',
  supplyType: '',
  documentDate: TODAY,
  sellerGstProfileId: '',
  fromPin: '',
  fromCity: '',
  toGstin: '',
  toLegalName: '',
  toPin: '',
  toCity: '',
  hsnCode: '',
  taxableValue: '',
  vehicleNumber: '',
  transportMode: '',
  distanceKm: '',
}

// Demo-only helper — no real IRP/GSP call happens anywhere in this flow.
function fakeEwbNumber() {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
}

type Stage = 'form' | 'generating' | 'generated'

export default function EWayBillPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['e-way-bill-form-options'],
    queryFn: utilitiesService.getEWayBillFormOptions,
  })

  const [form, setForm] = useState<EWayBillFormState>(EMPTY_FORM)
  const [stage, setStage] = useState<Stage>('form')
  const [stepIndex, setStepIndex] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<EWayBillGeneratedResult | null>(null)

  function updateField(field: EWayBillFormField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setResult(null)
    setStage('form')
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function handleSubmit() {
    setSubmitError(null)

    const taxableValueNum = Number(form.taxableValue)
    const distanceKmNum = Number(form.distanceKm)

    if (
      !form.transactionType ||
      !form.supplyType ||
      !form.documentDate ||
      !form.sellerGstProfileId ||
      !form.toGstin ||
      !form.hsnCode ||
      !form.taxableValue ||
      Number.isNaN(taxableValueNum) ||
      taxableValueNum <= 0 ||
      !form.vehicleNumber ||
      !form.transportMode ||
      !form.distanceKm ||
      !Number.isInteger(distanceKmNum) ||
      distanceKmNum <= 0
    ) {
      setSubmitError('Please fill in all required fields with valid values.')
      return
    }
    if (!data) return

    const payload: CreateEWayBillPayload = {
      transactionType: form.transactionType as CreateEWayBillPayload['transactionType'],
      supplyType: form.supplyType as CreateEWayBillPayload['supplyType'],
      documentDate: form.documentDate,
      sellerGstProfileId: Number(form.sellerGstProfileId),
      fromPin: form.fromPin || undefined,
      fromCity: form.fromCity || undefined,
      toGstin: form.toGstin,
      toLegalName: form.toLegalName || undefined,
      toPin: form.toPin || undefined,
      toCity: form.toCity || undefined,
      hsnCode: form.hsnCode,
      taxableValue: taxableValueNum,
      vehicleNumber: form.vehicleNumber,
      transportMode: form.transportMode as CreateEWayBillPayload['transportMode'],
      distanceKm: distanceKmNum,
    }

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

      const sellerProfile = data.sellerGstProfiles.find((p) => String(p.id) === form.sellerGstProfileId)
      const supplyTypeLabel = SUPPLY_TYPE_LABELS[form.supplyType] ?? form.supplyType
      const transportModeLabel =
        data.transportModes.find((m) => m.value === form.transportMode)?.label ?? form.transportMode

      setResult({
        ewbNumber: fakeEwbNumber(),
        ewbDate: new Date().toISOString(),
        validUntil: String(createResult.validUntil),
        documentNumber: createResult.documentNumber,
        documentDate: form.documentDate,
        supplyTypeLabel,
        fromLegalName: sellerProfile?.label ?? '—',
        fromGstin: sellerProfile?.gstin ?? '',
        fromCity: form.fromCity || '—',
        toLegalName: form.toLegalName || '—',
        toGstin: form.toGstin,
        toCity: form.toCity || '—',
        hsnCode: form.hsnCode,
        taxableValue: taxableValueNum,
        vehicleNumber: form.vehicleNumber,
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
        <EWayBillResult result={result} onReset={resetForm} />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
          <div className="section-card">
            {stage === 'generating' ? (
              <DocumentGeneratingView
                title="Generating E-Way Bill..."
                subtitle="Connecting to GST e-way bill API"
                steps={GENERATING_STEPS}
                stepIndex={stepIndex}
              />
            ) : (
              <EWayBillForm
                data={data}
                form={form}
                today={TODAY}
                error={submitError}
                onChange={updateField}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          <EWayBillAbout validityRules={data.validityRules} complianceNotice={data.complianceNotice} />
        </div>
      )}
    </div>
  )
}