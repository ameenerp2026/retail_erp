import type { GSTStateRecord } from '@/types/gstState'

export const MOCK_GST_STATES: GSTStateRecord[] = [
  { id: "1",  code: "01", stateName: "Jammu & Kashmir", igst: false, cgstSgst: true, sez: true, linkedGstins: 2, lastUpdated: "21 May 2026", createdBy: "Admin" },
  { id: "2",  code: "02", stateName: "Himachal Pradesh", igst: true, cgstSgst: true, sez: false, linkedGstins: 1, lastUpdated: "15 May 2026", createdBy: "Admin" },
  { id: "3",  code: "03", stateName: "Punjab",            igst: true, cgstSgst: true, sez: false, linkedGstins: 3, lastUpdated: "15 May 2026", createdBy: "Admin" },
  { id: "4",  code: "06", stateName: "Haryana",           igst: true, cgstSgst: true, sez: true,  linkedGstins: 4, lastUpdated: "14 May 2026", createdBy: "Admin" },
  { id: "5",  code: "07", stateName: "Delhi",             igst: true, cgstSgst: true, sez: true,  linkedGstins: 5, lastUpdated: "20 May 2026", createdBy: "Admin" },
  { id: "6",  code: "08", stateName: "Rajasthan",         igst: true, cgstSgst: true, sez: false, linkedGstins: 3, lastUpdated: "12 May 2026", createdBy: "Admin" },
  { id: "7",  code: "09", stateName: "Uttar Pradesh",     igst: true, cgstSgst: true, sez: false, linkedGstins: 7, lastUpdated: "18 May 2026", createdBy: "Admin" },
  { id: "8",  code: "19", stateName: "West Bengal",       igst: true, cgstSgst: true, sez: false, linkedGstins: 4, lastUpdated: "17 May 2026", createdBy: "Admin" },
  { id: "9",  code: "20", stateName: "Jharkhand",         igst: true, cgstSgst: true, sez: false, linkedGstins: 2, lastUpdated: "10 May 2026", createdBy: "Admin" },
  { id: "10", code: "21", stateName: "Odisha",            igst: true, cgstSgst: true, sez: false, linkedGstins: 2, lastUpdated: "10 May 2026", createdBy: "Admin" },
  { id: "11", code: "22", stateName: "Chhattisgarh",      igst: true, cgstSgst: true, sez: false, linkedGstins: 1, lastUpdated: "09 May 2026", createdBy: "Admin" },
]