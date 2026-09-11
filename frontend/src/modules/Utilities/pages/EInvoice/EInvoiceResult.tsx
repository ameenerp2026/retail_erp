import { useRef } from 'react'
import { CheckCircle2, Share2, Printer, Download, Info } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { generateDocumentPdf } from '@/utils/generateDocumentPdf'
import type { EInvoiceGeneratedResult } from './EInvoiceGeneration.types'

interface EInvoiceResultProps {
  result: EInvoiceGeneratedResult
  onReset: () => void
}

export default function EInvoiceResult({ result, onReset }: EInvoiceResultProps) {
  const qrRef = useRef<HTMLCanvasElement>(null)

  function handleDownloadPdf() {
    const taxRows = result.sameState
      ? [
          {
            label: `CGST (${(result.gstRate / 2).toFixed(1)}%)`,
            value: `Rs. ${(result.taxAmount / 2).toLocaleString('en-IN')}`,
          },
          {
            label: `SGST (${(result.gstRate / 2).toFixed(1)}%)`,
            value: `Rs. ${(result.taxAmount / 2).toLocaleString('en-IN')}`,
          },
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

  return (
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
              <QRCodeCanvas ref={qrRef} value={result.irn} size={80} level="M" fgColor="#043793" />
            </div>
            <p className="text-center text-[10px] font-semibold leading-tight text-[#0aa6a6]">
              GST PORTAL VALIDATION READY
            </p>
            <p className="text-center text-[10px] leading-tight text-slate-400">Scanned for GST portal validation</p>
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
              onClick={onReset}
              className="h-9 rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Cancel IRN
            </button>
            <button
              type="button"
              onClick={onReset}
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
  )
}