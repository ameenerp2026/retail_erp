import { FinanceStat, FinancePeriod } from '@/types/finance'

export const MOCK_STATS: FinanceStat[] = [
  { id: '1', type: 'open', label: 'Open Periods', count: 3 },
  { id: '2', type: 'closed', label: 'Closed Periods', count: 9 },
  { id: '3', type: 'provisional', label: 'Provisional', count: 2 },
  { id: '4', type: 'pending', label: 'Pending Invoices', count: 14 }
]

export const MOCK_PERIODS: FinancePeriod[] = [
   {
    id: "1",
    period: "APR-26",
    startDate: "01 Apr 2026",
    endDate: "30 Apr 2026", 
    financeStatus: "Open",
    invStatus: "Open",
    cogsStatus: "Running",
    lastModified: "12 Jun 2026 09:14"
  },
  {
    id: "2",
    period: "MAR-26",
    startDate: "01 Mar 2026",
    endDate: "31 Mar 2026",
    financeStatus: "Closed", 
    invStatus: "Closed",
    cogsStatus: "Completed",
    lastModified: "01 Apr 2026 18:32"
  },
  {
    id: "3",
    period: "FEB-26",
    startDate: "01 Feb 2026",
    endDate: "28 Feb 2026",
    financeStatus: "Closed",
    invStatus: "Closed", 
    cogsStatus: "Completed",
    lastModified: "01 Mar 2026 17:55"
  },
  {
    id: "4",
    period: "JAN-26",
    startDate: "01 Jan 2026", 
    endDate: "31 Jan 2026",
    financeStatus: "Provisional",
    invStatus: "Closed",
    cogsStatus: "Completed", 
    lastModified: "02 Feb 2026 08:10"
  },
  {
    id: "5",
    period: "DEC-25",
    startDate: "01 Dec 2025",
    endDate: "31 Dec 2025",
    financeStatus: "Closed",
    invStatus: "Closed",
    cogsStatus: "Completed",
    lastModified: "03 Jan 2026 11:22"
  },
  {
    id: "6", 
    period: "NOV-25",
    startDate: "01 Nov 2025",
    endDate: "30 Nov 2025",
    financeStatus: "Open",
    invStatus: "Open",
    cogsStatus: "Pending",
    lastModified: "10 Jun 2026 14:00"
  },
  {
    id: "7",
    period: "OCT-25", 
    startDate: "01 Oct 2025",
    endDate: "31 Oct 2025",
    financeStatus: "Provisional",
    invStatus: "Provisional", 
    cogsStatus: "Running",
    lastModified: "11 Jun 2026 09:30"
  },
  {
    id: "8",
    period: "SEP-25",
    startDate: "01 Sep 2025",
    endDate: "30 Sep 2025", 
    financeStatus: "Open",
    invStatus: "Open",
    cogsStatus: "Pending",
    lastModified: "09 Jun 2026 13:10"
  }
]