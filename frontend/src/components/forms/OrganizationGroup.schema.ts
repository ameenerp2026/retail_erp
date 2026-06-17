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
   .custom<FileList>()
   .refine((files) => files?.length === 1, 'Logo is required')
   .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size 5MB`)
   .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
      'Only.jpg,.png allowed'
    )
   .optional(), // remove.optional() if required
})

export type OrganizationFormData = z.infer<typeof organizationSchema>