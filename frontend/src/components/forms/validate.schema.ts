import { z } from 'zod'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export const organizationSchema = z.object({
  shortName: z.string().min(1, 'Short Name is required'),
  financialYear: z.string(),
  currency: z.string().min(1, 'Select currency'),
  companyName: z.string().min(1, 'Company Name is required'),
  cinNumber: z.string()
  .trim()
  .toUpperCase()
   .min(1, 'CIN is required')
   .length(21, 'CIN must be exactly 21 characters')
   .regex(/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, 'Invalid CIN format'),
  panNumber: z.string()
   .min(1, 'PAN is required')
   .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
phoneNumber: z.string()
  .trim()
  .optional()
  .refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: "Phone number must be 10 digits"
  }),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'Select state'),
  country: z.string().min(1, 'Select country'),
 pinCode: z.string()
  .trim()
  .length(6, "PIN Code must be 6 digits")
  .regex(/^[1-9]\d{5}$/, "Invalid PIN Code format"),
 logo: z
  .instanceof(FileList) // Use instanceof instead of custom
  .refine((files) => files?.length === 1, 'Logo is required')
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size 5MB`)
  .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
      'Only.jpg,.png allowed'
    )
  .optional()
})

export type OrganizationFormData = z.infer<typeof organizationSchema>

export const orgUnitSchema = z.object({
  name: z.string().trim().min(1, 'Unit name is required').min(3, 'Minimum 3 characters'),
  
  type: z.enum(['Head Office', 'Regional Office', 'Branch', 'Warehouse'], {
    message: 'Unit type is required' // ← Use 'message' not 'errorMap'
  }),
  
  group: z.string().min(1, 'Organization Group is required'),
  
  gstin: z.string()
    .trim()
    .min(1, 'GSTIN is required')
    .length(15, 'GSTIN must be 15 characters')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),
  
  manager: z.string().trim().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional()
})


export type OrgUnitFormData = z.infer<typeof orgUnitSchema> & {
  id?: string
}


export const businessLocationSchema = z.object({
  locationName: z.string().min(1, 'Location Name is required'),
  //locationCode: z.string().min(1, 'Location Code is required'),
  parentOrganizationUnit: z.string().min(1, 'Select organization unit'),
  locationType: z.string().min(1, 'Select location Type'),
   businessCategory: z.string().min(1, 'Select Business Category'),
   addressLine1: z.string().min(1, 'Address Line1 is required'),
   addressLine2: z.string().min(1, 'Address Line2 is required'),
   landmark: z.string().min(1, 'Landmark is required'),
   city: z.string().min(1, 'City Name is required'),
   state: z.string().min(1, 'Select location State'),
   country: z.string().min(1, 'Select Business Country'),
pinCode: z.string()
  .trim()
  .length(6, "PIN Code must be 6 digits")
  .regex(/^[1-9]\d{5}$/, "Invalid PIN Code format"),
   contactPerson: z.string().min(1, 'Contact Person is required'),
  phoneNumber: z.string()
  .trim()
  .optional()
  .refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: "Phone number must be 10 digits"
  }),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
emergencyContact: z.string()
  .trim()
  .optional()
  .refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: "Emergency Contact must be 10 digits"
  }),
 
  linkedGSTIN: z.string().min(1, 'Select Linked GSTIN'),
  registrationType: z.string().min(1, 'Select Registration Type'),
 defaultBillingLocation:z.boolean(),
 defaultStockLocation:z.boolean(),
 allowSales:z.boolean(),
  allowPurchase:z.boolean(),
 allowInventory:z.boolean(),
 allowDispatch:z.boolean(),
 allowPOS:z.boolean(),
 status:z.boolean(),
 defaultWarehouse: z.string().min(1, 'Select Warehouse'),
 parentWarehouse: z.string().min(1, 'Select Parent Warehouse'),
})

export type businessLocationFormData = z.infer<typeof businessLocationSchema>



export const accountingYearSchema = z.object({
  fromDate: z.string().min(1, 'Start date is required'),
  toDate: z.string().min(1, 'End date is required'),
  // yearName: z.string()
  //  .trim()
  //  .min(1, 'Year name is required')
  //  .min(3, 'Year name must be at least 3 characters')
})
.refine((data) => new Date(data.fromDate) < new Date(data.toDate), {
  message: 'End date must be after start date',
  path: ['toDate']
})

export type AccountingYearFormData = z.infer<typeof accountingYearSchema>
// ── Account Class ──────────────────────────────────────────────
export const accountClassSchema = z.object({
  className: z.string()
    .trim()
    .min(1, 'Class name is required')
    .min(3, 'Class name must be at least 3 characters')
    .max(50, 'Class name must be under 50 characters'),

  accountGroup: z.string()
    .min(1, 'Account group is required'),

  description: z.string()
    .trim()
    .max(200, 'Description must be under 200 characters')
    .optional(),

  status: z.enum(['Active', 'Inactive'], {
    message: 'Status is required'
  }),
})

export type AccountClassFormData = z.infer<typeof accountClassSchema>
// ── Currency ───────────────────────────────────────────────────
export const currencySchema = z.object({
  code: z.string()
    .trim()
    .toUpperCase()
    .min(1, 'Currency code is required')
    .length(3, 'Currency code must be exactly 3 letters')
    .regex(/^[A-Z]{3}$/, 'Use the 3-letter ISO code (e.g. USD)'),

  name: z.string()
    .trim()
    .min(1, 'Currency name is required')
    .min(3, 'Currency name must be at least 3 characters')
    .max(50, 'Currency name must be under 50 characters'),

  symbol: z.string()
    .trim()
    .min(1, 'Symbol is required')
    .max(4, 'Symbol must be under 4 characters'),

  exchangeRate: z
    .number({ message: 'Exchange rate is required' })
    .positive('Exchange rate must be greater than 0'),

  isBase: z.boolean(),
})

export type CurrencyFormData = z.infer<typeof currencySchema>
// ── GSTIN ──────────────────────────────────────────────────────
export const gstinSchema = z.object({
  gstin: z.string()
    .trim()
    .toUpperCase()
    .min(1, 'GSTIN is required')
    .length(15, 'GSTIN must be 15 characters')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),

  state: z.string().min(1, 'State is required'),

  orgUnit: z.string().min(1, 'Org Unit is required'),

  type: z.enum(['Regular', 'Composition'], {
    message: 'Type is required'
  }),
})

export type GstinFormData = z.infer<typeof gstinSchema>


