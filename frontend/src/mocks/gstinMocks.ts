import type { GSTINRecord } from '@/types/gstin'

// Consistent fake IDs per org unit name — mock-only, doesn't need to match real DB IDs
const ORG_UNIT_ID: Record<string, number> = {
  'HQ - Mumbai': 1,
  'Delhi North': 2,
  'Bangalore Central': 3,
  'Chennai South': 4,
  'Hyderabad Central': 5,
  'Pune West': 6,
}

function orgUnit(name: string) {
  return { id: ORG_UNIT_ID[name], organizationUnit: name }
}

export const MOCK_GSTIN_RECORDS: GSTINRecord[] = [
  { id: "1", gstin: "27AABCS1429B1ZB", state: "Maharashtra", organizationUnitId: ORG_UNIT_ID['HQ - Mumbai'],       organizationUnit: orgUnit('HQ - Mumbai'),       type: "Regular",     status: "Verified", lastVerified: "18 May 2026" },
  { id: "2", gstin: "07AABCS1429B1ZC", state: "Delhi",       organizationUnitId: ORG_UNIT_ID['Delhi North'],       organizationUnit: orgUnit('Delhi North'),       type: "Regular",     status: "Verified", lastVerified: "18 May 2026" },
  { id: "3", gstin: "29AABCS1429B1ZD", state: "Karnataka",   organizationUnitId: ORG_UNIT_ID['Bangalore Central'], organizationUnit: orgUnit('Bangalore Central'), type: "Regular",     status: "Pending",  lastVerified: null          },
  { id: "4", gstin: "33AABCS1429B1ZE", state: "Tamil Nadu",  organizationUnitId: ORG_UNIT_ID['Chennai South'],     organizationUnit: orgUnit('Chennai South'),     type: "Composition", status: "Failed",   lastVerified: "12 May 2026" },
  { id: "5", gstin: "36AABCS1429B1ZF", state: "Telangana",   organizationUnitId: ORG_UNIT_ID['Hyderabad Central'], organizationUnit: orgUnit('Hyderabad Central'), type: "Regular",     status: "Verified", lastVerified: "20 May 2026" },
  { id: "6", gstin: "27AABCS1429B1ZG", state: "Maharashtra", organizationUnitId: ORG_UNIT_ID['Pune West'],         organizationUnit: orgUnit('Pune West'),         type: "Regular",     status: "Verified", lastVerified: "19 May 2026" },
]