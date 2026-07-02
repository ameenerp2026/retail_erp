type StatItem = {
  id: number
  label: string
  count: number
  textColor: string
}

export const GSTIN_STAT_CARDS: StatItem[] = [
  { id: 1, label: "Total GSTINs", count: 6, textColor: "text-[#0B4D8C]" },
  { id: 2, label: "Verified",     count: 4, textColor: "text-[#22C55E]" },
  { id: 3, label: "Pending",      count: 1, textColor: "text-[#F59E0B]" },
  { id: 4, label: "Failed",       count: 1, textColor: "text-[#EF4444]" },
]

export const GST_STATE_STAT_CARDS:StatItem[]=[
    {id:1,label:"Total States",count:20,textColor:"text-[#0B4D8C]"},
    {id:2,label:"Active GSTINs",count:98,textColor:"text-[#21B6A8]"},
    {id:3,label:"IGST Enabled",count:19,textColor:"text-[#22C55E]"},
    {id:4,label:"States with SEZ",count:8,textColor:"text-[#F59E0B]"}
]