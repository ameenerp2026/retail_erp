import { useRef, useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/shared/Modal'
import { useImport } from '@/hooks/useImport'
import {
  downloadImportTemplate,
  type ImportErrorResponse,
  type ImportRowError,
} from '@/services/import.service'

type ImportDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  importUrl: string
  templateUrl: string
  templateFileName: string
  invalidateKey: readonly unknown[]
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ImportErrorResponse>(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

export default function ImportDialog({
  open,
  ...props
}: ImportDialogProps) {
  return open ? <ImportDialogContent {...props} /> : null
}

function ImportDialogContent({
  onClose,
  title,
  importUrl,
  templateUrl,
  templateFileName,
  invalidateKey,
}: Omit<ImportDialogProps, 'open'>) {
  const [file, setFile] = useState<File | null>(null)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [rowErrorMessage, setRowErrorMessage] = useState<string | null>(null)
  const [rowErrors, setRowErrors] = useState<ImportRowError[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importMutation = useImport({ importUrl, invalidateKey })

  const handleDownloadTemplate = async () => {
    try {
      await downloadImportTemplate(templateUrl, templateFileName)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to download import template'))
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
    setValidationMessage(null)
    setRowErrorMessage(null)
    setRowErrors([])
  }

  const handleClearFile = () => {
    setFile(null)
    setValidationMessage(null)
    setRowErrorMessage(null)
    setRowErrors([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setValidationMessage('Choose an .xlsx file to continue.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setValidationMessage('The file must be 2 MB or smaller.')
      return
    }

    setValidationMessage(null)
    setRowErrorMessage(null)
    setRowErrors([])

    try {
      const response = await importMutation.mutateAsync(file)
      toast.success(response.message)
      handleClearFile()
      onClose()
    } catch (error) {
      if (
        axios.isAxiosError<ImportErrorResponse>(error) &&
        error.response?.status === 400 &&
        Array.isArray(error.response.data?.errors)
      ) {
        setRowErrorMessage(error.response.data.message || 'Import failed')
        setRowErrors(error.response.data.errors)
        return
      }

      toast.error(getErrorMessage(error, 'Import failed'))
    }
  }

  return (
    <Modal isOpen onClose={onClose} maxWidth="lg">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close import dialog"
          className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5 overflow-y-auto px-5 py-5">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Use the Excel template</p>
          <p className="mb-2 text-xs text-slate-500">
            Download the template, fill in your data, and upload the completed file.
          </p>
          <button
            type="button"
            onClick={() => void handleDownloadTemplate()}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Download template
          </button>
        </div>

        <div>
          <label htmlFor="import-xlsx-file" className="mb-1.5 block text-sm font-medium text-slate-800">
            Excel file
          </label>
          <input
            ref={fileInputRef}
            id="import-xlsx-file"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          {file && (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <span className="min-w-0 truncate text-sm text-slate-700">{file.name}</span>
              <button
                type="button"
                onClick={handleClearFile}
                aria-label="Clear selected file"
                className="shrink-0 text-xs font-medium text-slate-500 hover:text-red-600"
              >
                Clear
              </button>
            </div>
          )}
          <p className="mt-1.5 text-xs text-slate-500">.xlsx files up to 2 MB</p>
          {validationMessage && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {validationMessage}
            </p>
          )}
        </div>

        {rowErrorMessage && (
          <section aria-live="polite" className="space-y-3">
            <p className="text-sm font-medium text-red-700">{rowErrorMessage}</p>
            <p className="text-sm text-slate-700">
              Fix these rows in your file and upload it again. Nothing was imported.
            </p>
            <div className="max-h-64 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">Import validation errors</caption>
                <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                  <tr>
                    <th scope="col" className="px-3 py-2">Row</th>
                    <th scope="col" className="px-3 py-2">Column</th>
                    <th scope="col" className="px-3 py-2">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rowErrors.map((error, index) => (
                    <tr key={`${error.row}-${error.column}-${index}`}>
                      <td className="px-3 py-2 align-top text-slate-700">{error.row}</td>
                      <td className="px-3 py-2 align-top text-slate-700">{error.column}</td>
                      <td className="px-3 py-2 align-top text-slate-700">{error.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={!file || importMutation.isPending}
          className="rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {importMutation.isPending ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </Modal>
  )
}
