import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'
import type { CreateEInvoicePayload } from '@/types/Einvoice'
import DocumentGeneratingView from '../../components/Documents/DocumentGeneratingView'
import EInvoiceForm from './EInvoiceForm'
import EInvoiceResult from './EInvoiceResult'
import EInvoiceAbout from './EInvoiceAbout'
import type { EInvoiceFormField, EInvoiceFormState, EInvoiceGeneratedResult } from './EInvoiceGeneration.types'

function todayISODate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const TODAY = todayISODate()

const GENERATING_STEPS = ['Validating invoice data...', 'Authenticating with NIC portal...', 'Generating IRN and QR...']

const EMPTY_FORM: EInvoiceFormState = {
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
}

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

type Stage = 'form' | 'generating' | 'generated'

export default function EInvoicePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['e-invoice-form-options'],
    queryFn: utilitiesService.getEInvoiceFormOptions,
  })

  const [form, setForm] = useState<EInvoiceFormState>(EMPTY_FORM)
  const [stage, setStage] = useState<Stage>('form')
  const [stepIndex, setStepIndex] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<EInvoiceGeneratedResult | null>(null)

  function updateField(field: EInvoiceFormField, value: string) {
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
    if (
      !form.transactionType ||
      !form.supplyType ||
      !form.documentDate ||
      !form.sellerGstProfileId ||
      !form.toGstin ||
      !form.hsnCode ||
      !form.taxableValue ||
      Number.isNaN(taxableValueNum) ||
      taxableValueNum <= 0
    ) {
      setSubmitError('Please fill in all required fields with valid values.')
      return
    }
    if (!data) return

    const payload: CreateEInvoicePayload = {
      transactionType: form.transactionType as CreateEInvoicePayload['transactionType'],
      supplyType: form.supplyType as CreateEInvoicePayload['supplyType'],
      documentDate: form.documentDate,
      sellerGstProfileId: Number(form.sellerGstProfileId),
      fromPin: form.fromPin || undefined,
      fromCity: form.fromCity || undefined,
      toGstin: form.toGstin,
      toLegalName: form.toLegalName || undefined,
      toPin: form.toPin || undefined,
      toCity: form.toCity || undefined,
      items: [{ hsnCode: form.hsnCode, taxableValue: taxableValueNum }],
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

      const sellerProfile = data.sellerGstProfiles.find((p) => String(p.id) === form.sellerGstProfileId)
      const hsn = data.hsnCodes.find((h) => h.code === form.hsnCode)
      const gstRate = hsn?.gstRate ?? 0
      const buyerStateCode = form.toGstin.slice(0, 2)
      const sameState = sellerProfile?.stateCode === buyerStateCode
      const taxAmount = Math.round(((taxableValueNum * gstRate) / 100) * 100) / 100
      const grandTotal = taxableValueNum + taxAmount
      const supplyTypeLabel = data.supplyTypes.find((s) => s.value === form.supplyType)?.label ?? form.supplyType

      setResult({
        irn: fakeIrn(),
        ackNumber: fakeAckNumber(),
        ackDate: formatAckDate(new Date()),
        documentNumber: createResult.documentNumber,
        documentDate: form.documentDate,
        supplyTypeLabel,
        fromGstin: sellerProfile?.gstin ?? '',
        toGstin: form.toGstin,
        fromCity: form.fromCity || '—',
        toCity: form.toCity || '—',
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
        <EInvoiceResult result={result} onReset={resetForm} />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
          <div className="section-card">
            {stage === 'generating' ? (
              <DocumentGeneratingView
                title="Generating IRN..."
                subtitle="Connecting to GST e-invoice API"
                steps={GENERATING_STEPS}
                stepIndex={stepIndex}
              />
            ) : (
              <EInvoiceForm
                data={data}
                form={form}
                today={TODAY}
                error={submitError}
                onChange={updateField}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          <EInvoiceAbout />
        </div>
      )}
    </div>
  )
}