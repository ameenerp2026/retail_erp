export type GSTStateRecord = {
  id: string
  code: string
  stateName: string
  igst: boolean
  cgstSgst: boolean
  sez: boolean
  linkedGstins: number
  lastUpdated: string
}
