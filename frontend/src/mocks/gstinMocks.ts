import type { GSTINRecord } from '@/types/gstin'

export const MOCK_GSTIN_RECORDS: GSTINRecord[] = [
  { id: "1", gstin: "27AABCS1429B1ZB", state: "Maharashtra", orgUnit: "HQ - Mumbai",       type: "Regular",     status: "Verified", lastVerified: "18 May 2026" },
  { id: "2", gstin: "07AABCS1429B1ZC", state: "Delhi",       orgUnit: "Delhi North",       type: "Regular",     status: "Verified", lastVerified: "18 May 2026" },
  { id: "3", gstin: "29AABCS1429B1ZD", state: "Karnataka",   orgUnit: "Bangalore Central", type: "Regular",     status: "Pending",  lastVerified: null          },
  { id: "4", gstin: "33AABCS1429B1ZE", state: "Tamil Nadu",  orgUnit: "Chennai South",     type: "Composition", status: "Failed",   lastVerified: "12 May 2026" },
  { id: "5", gstin: "36AABCS1429B1ZF", state: "Telangana",   orgUnit: "Hyderabad Central", type: "Regular",     status: "Verified", lastVerified: "20 May 2026" },
  { id: "6", gstin: "27AABCS1429B1ZG", state: "Maharashtra", orgUnit: "Pune West",         type: "Regular",     status: "Verified", lastVerified: "19 May 2026" },
]