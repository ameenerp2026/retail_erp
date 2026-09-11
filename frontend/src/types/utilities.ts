export type ImportTypeOption = {
  value: string
  label: string
  templateTitle: string
  templateDescription: string
  templateUrl: string
  templateFileName: string
  importUrl: string
  // Optional: only set for import types that have a working /import/preview
  // route (currently just ledgers). The frontend checks for this and shows
  // "No preview endpoint configured" rather than silently falling back to
  // the commit route when it's missing.
  previewUrl?: string
}

export type ImportStep = {
  id: string
  step: string
  title: string
  description: string
}

export type DataImportInfo = {
  searchPlaceholder: string
  importTypes: ImportTypeOption[]
  howToTitle: string
  howToSubtitle: string
  steps: ImportStep[]
  uploadTitle: string
  uploadHint: string
}

export type GstFormField = {
  key: string
  label: string
  placeholder: string
  required?: boolean
  fullWidth?: boolean
}

export type EInvoiceInfo = {
  title: string
  description: string
  bullets: string[]
  fields: GstFormField[]
}

export type EWayValidityRule = {
  id: string
  distance: string
  validity: string
}

export type EWayBillInfo = {
  fields: GstFormField[]
  transportModes: string[]
  validityRules: EWayValidityRule[]
  complianceNotice: string
}