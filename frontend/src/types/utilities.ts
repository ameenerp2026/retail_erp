export type ImportStep = {
  id: string
  step: string
  title: string
  description: string
}

export type DataImportInfo = {
  searchPlaceholder: string
  templateTitle: string
  templateDescription: string
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
