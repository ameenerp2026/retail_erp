import { InventoryStat,InventoryPeriod, COGSRun, } from '@/types/inventory'

export const MOCK_STATS: InventoryStat[] = [
  { id: '1', type: 'Open', label: 'Open Months', count: 12 },
  { id: '2', type: 'Closed', label: 'Closed Months', count: 0 },
  { id: '3', type: 'Pending', label: 'Pending COGS', count: 12 },
  { id: '4', type: 'Unposted', label: 'Unposted Documents', count: 6 }
]

export const MOCK_PERIODS: InventoryPeriod[] = [
   {
    id: "1",
    period: "APR-26",
    startDate: "01 Apr 2026",
    endDate: "30 Apr 2026", 
    financeStatus: "Open",
    invStatus: "Open",
    cogsStatus: "Running",
    lastModified: "12 Jun 2026 09:14",
    modifiedBy: "System"
  },
  {
    id: "2",
    period: "MAR-26",
    startDate: "01 Mar 2026",
    endDate: "31 Mar 2026",
    financeStatus: "Closed", 
    invStatus: "Closed",
    cogsStatus: "Completed",
    lastModified: "01 Apr 2026 18:32",
    modifiedBy: "System"
  },
  {
    id: "3",
    period: "FEB-26",
    startDate: "01 Feb 2026",
    endDate: "28 Feb 2026",
    financeStatus: "Closed",
    invStatus: "Closed", 
    cogsStatus: "Completed",
    lastModified: "01 Mar 2026 17:55",
    modifiedBy: "Finance Admin"
  },
  {
    id: "4",
    period: "JAN-26",
    startDate: "01 Jan 2026", 
    endDate: "31 Jan 2026",
    financeStatus: "Provisional",
    invStatus: "Closed",
    cogsStatus: "Completed", 
    lastModified: "02 Feb 2026 08:10",
    modifiedBy: "Finance Admin"
  },
  {
    id: "5",
    period: "DEC-25",
    startDate: "01 Dec 2025",
    endDate: "31 Dec 2025",
    financeStatus: "Closed",
    invStatus: "Closed",
    cogsStatus: "Completed",
    lastModified: "03 Jan 2026 11:22",
    modifiedBy: "System"
  },
  {
    id: "6", 
    period: "NOV-25",
    startDate: "01 Nov 2025",
    endDate: "30 Nov 2025",
    financeStatus: "Open",
    invStatus: "Open",
    cogsStatus: "Pending",
    lastModified: "10 Jun 2026 14:00",
    modifiedBy: "System"
  },
  {
    id: "7",
    period: "OCT-25", 
    startDate: "01 Oct 2025",
    endDate: "31 Oct 2025",
    financeStatus: "Provisional",
    invStatus: "Provisional", 
    cogsStatus: "Running",
    lastModified: "11 Jun 2026 09:30",
    modifiedBy: "Finance Admin"
  },
  {
    id: "8",
    period: "SEP-25",
    startDate: "01 Sep 2025",
    endDate: "30 Sep 2025", 
    financeStatus: "Open",
    invStatus: "Open",
    cogsStatus: "Pending",
    lastModified: "09 Jun 2026 13:10",
    modifiedBy: "System"
  }
]

// Mock data for COGS runs
export const MOCK_COGS: COGSRun[] = [
  { id: "1", month: "APR-26", startTime: "12 Jun 2026 09:14", endTime: "12 Jun 2026 09:16", runtime: "2m 34s", status: "Running",   runBy: "Admin User"    },
  { id: "2", month: "MAR-26", startTime: "01 Apr 2026 18:00", endTime: "01 Apr 2026 18:03", runtime: "3m 12s", status: "Completed", runBy: "Finance Admin"  },
  { id: "3", month: "FEB-26", startTime: "01 Mar 2026 17:00", endTime: "01 Mar 2026 17:02", runtime: "2m 45s", status: "Completed", runBy: "Finance Admin"  },
  { id: "4", month: "JAN-26", startTime: "02 Feb 2026 08:10", endTime: "02 Feb 2026 08:13", runtime: "3m 02s", status: "Completed", runBy: "Admin User"    },
  { id: "5", month: "DEC-25", startTime: "03 Jan 2026 11:00", endTime: "03 Jan 2026 11:04", runtime: "4m 10s", status: "Completed", runBy: "Finance Admin"  },
  { id: "6", month: "NOV-25", startTime: "01 Dec 2025 16:00", endTime: "01 Dec 2025 16:02", runtime: "2m 22s", status: "Failed",    runBy: "System"        },
  { id: "7", month: "OCT-25", startTime: "01 Nov 2025 14:00", endTime: "01 Nov 2025 14:03", runtime: "3m 55s", status: "Completed", runBy: "Admin User"    },
  { id: "8", month: "SEP-25", startTime: "01 Oct 2025 09:00", endTime: "01 Oct 2025 09:02", runtime: "2m 18s", status: "Completed", runBy: "Finance Admin"  },
]

// Mock data recalcute COGS months
export const summaryItems = [
  { label: 'Selected Year', value: 'FY 2025-26' },
  { label: 'Organization', value: 'HQ - Mumbai' },
  { label: 'Total Months', value: '12 Months' },
  { label: 'Pending Months', value: '2 Selected' },
];

export const Recalculate_COGS_months = [
  { id: "1", month: 'APR-26', period: 'Apr 2026', status: 'Running' },
  { id: "2", month: 'MAR-26', period: 'Mar 2026', status: 'Pending' },
  { id: "3", month: 'FEB-26', period: 'Feb 2026', status: 'Completed' },
  { id: "4", month: 'JAN-26', period: 'Jan 2026', status: 'Completed' },
  { id: "5", month: 'DEC-25', period: 'Dec 2025', status: 'Completed' },
  { id: "6", month: 'NOV-25', period: 'Nov 2025', status: 'Pending' },
  { id: "7", month: 'OCT-25', period: 'Oct 2025', status: 'Pending' },
];

export const logEntries = [
  { time: '09:14:02', level: '[INFO]', message: 'COGS recalculation job initiated' },
  { time: '09:14:03', level: '[INFO]', message: 'Loading inventory transactions for APR-26' },
  { time: '09:14:05', level: '[INFO]', message: 'Processing 12,847 transactions...' },
  { time: '09:14:11', level: '[INFO]', message: 'Applying FIFO costing method' },
  { time: '09:14:15', level: '[SUCCESS]', message: 'Valuation complete — 12,847 records processed' },
  { time: '09:14:16', level: '[INFO]', message: 'Updating GL entries for cost of goods sold' },
  { time: '09:14:17', level: '[WARN]', message: '3 items with negative stock detected — skipped' },
  { time: '09:14:18', level: '[INFO]', message: 'Generating journal entries for APR-26' },
];
//Unposted Documents mock data
export const documents = [
  {
    id: '1',
    site: 'Store - Andheri',
    entryType: 'Retail Sale',
    documentNumber: 'RS-2026-04-0831',
    documentDate: '28 Apr 2026',
    status: 'Pending',
   
  },
  {
    id: '2',
    site: 'Store - Bandra',
    entryType: 'Purchase',
    documentNumber: 'PO-2026-04-0198',
    documentDate: '27 Apr 2026',
    status: 'Pending',
    
  },
  {
    id: '3',
    site: 'Store - Thane',
    entryType: 'Retail Sale',
    documentNumber: 'RS-2026-04-0792',
    documentDate: '26 Apr 2026',
    status: 'Pending',
   
  },
];