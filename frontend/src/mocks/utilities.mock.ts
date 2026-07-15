import type { DataImportInfo, EInvoiceInfo, EWayBillInfo } from '@/types/utilities'

export const MOCK_DATA_IMPORT: DataImportInfo = {
  searchPlaceholder: 'Search import type',
  templateTitle: 'Sample Excel Template',
  templateDescription: 'Download the pre-formatted template to get started quickly',
  howToTitle: 'How to Use the Template',
  howToSubtitle: 'Follow these steps to import master data successfully',
  steps: [
    {
      id: '1',
      step: 'Step 1',
      title: 'Download Template',
      description:
        'Download the sample Excel template to see the required format for member details.',
    },
    {
      id: '2',
      step: 'Step 2',
      title: 'Fill the Excel File',
      description:
        'Enter member details in the required columns. Do not modify the column structure.',
    },
    {
      id: '3',
      step: 'Step 3',
      title: 'Upload File',
      description: 'Upload the completed CSV file to add multiple members instantly.',
    },
  ],
  uploadTitle: 'Drag & drop your file here',
  uploadHint: 'or click to browse — Supports .csv',
}

const sharedGstFields = [
  { key: 'transactionType', label: 'Transaction Type', placeholder: 'Outward / Inward' },
  { key: 'supplyType', label: 'Supply Type', placeholder: 'Business to Business' },
  {
    key: 'documentNumber',
    label: 'Document Number *',
    placeholder: 'INV-2024-0891',
    required: true,
  },
  {
    key: 'documentDate',
    label: 'Document Date *',
    placeholder: '21/05/2026',
    required: true,
  },
  {
    key: 'fromGstin',
    label: 'From GSTIN *',
    placeholder: '27AABCS1429B1ZB',
    required: true,
  },
  {
    key: 'toGstin',
    label: 'To GSTIN *',
    placeholder: '07AABCS1429B1ZC',
    required: true,
  },
  { key: 'fromPin', label: 'From PIN', placeholder: '400051' },
  { key: 'toPin', label: 'To PIN', placeholder: '110001' },
  { key: 'fromCity', label: 'From City', placeholder: 'Chennai' },
  { key: 'toCity', label: 'To City', placeholder: 'Banglore' },
  { key: 'hsn', label: 'Item HSN Code', placeholder: '6109' },
  { key: 'taxableValue', label: 'Taxable Value (₹)', placeholder: '105932.20' },
]

export const MOCK_E_INVOICE: EInvoiceInfo = {
  title: 'About E-Invoicing',
  description:
    'Generate Invoice Reference Numbers (IRN) and QR codes compliant with GST e-invoicing mandate for B2B transactions above ₹5 crore.',
  bullets: [
    'Mandatory for registered taxpayers',
    'Real-time registration with NIC portal',
    'Auto-populated in GSTR-1',
    'Prevents fake billing',
  ],
  fields: sharedGstFields,
}

export const MOCK_E_WAY_BILL: EWayBillInfo = {
  fields: [
    ...sharedGstFields,
    {
      key: 'vehicleNumber',
      label: 'Vehicle Number',
      placeholder: 'MH-01-AB-1234',
      fullWidth: true,
    },
  ],
  transportModes: ['Road', 'Rail', 'Air', 'Ship'],
  validityRules: [
    { id: '1', distance: 'Up to 100 km', validity: '1 day' },
    { id: '2', distance: '100 – 300 km', validity: '3 days' },
    { id: '3', distance: '300 – 500 km', validity: '5 days' },
    { id: '4', distance: '500 – 1000 km', validity: '10 days' },
    { id: '5', distance: 'Above 1000 km', validity: '15 days' },
  ],
  complianceNotice:
    'E-Way Bill is mandatory for inter-state movement of goods worth above ₹50,000.',
}
