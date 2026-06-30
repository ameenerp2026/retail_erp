import { StatusType } from "@/components/shared/StatusTags"
export type InventoryStatType = "Open" | "Closed" | "Pending" | "Unposted"
//
export type InventoryStat = {
  id: string | number
  type: InventoryStatType
  label: string
  count: number
}
// InventoryPeriod type definition
export type InventoryPeriod = {
  id: string
  period: string
  startDate: string
  endDate: string
  invStatus: StatusType
  financeStatus: StatusType
  cogsStatus: StatusType
  lastModified: string
  modifiedBy: string
}
// COGSRun type definition
export type COGSRun = {
  id: string
  month: string
  startTime: string
  endTime: string
  runtime: string
  status: string
  runBy: string
}
// COGSRunHistoryProps type definition
export type COGSRunHistoryProps = {
  isOpen: boolean
  onClose: () => void
  periodName: string  // e.g. "APR-26"
}
// RecalculateCOGS type definition
export type RecalculateCOGS = {
  id: string
  month: string
  period: string
  status: string  
}
// UnpostedDocumentsProps type definition
export type UnpostedDocumentsProps = {
  isOpen: boolean
  onClose: () => void
}

export type UnpostedDocument = {
  id: string
  site: string
  entryType: string
  documentNumber: string
  documentDate: string
  status: string
}