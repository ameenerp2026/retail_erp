
import {Calendar,Lock,Activity,AlertTriangle} from "lucide-react"
import { InventoryStatType } from '@/types/inventory'

type CardConfig = {
  logo: React.ReactNode
  logoBgColor: string
  drawerKey?: string
}

export const INVENTORY_CARD_CONFIG: Record<InventoryStatType, CardConfig> = {
  Open: {
    logo: <Calendar size={18} className="text-[#155DFC]" />,
    logoBgColor: "bg-[#EFF6FF]",
    drawerKey: "Open",
  },
  Closed: {
    logo: <Lock size={18} className="text-[#E7000B]" />,
    logoBgColor: "bg-[#FEF2F2]",
    drawerKey: "Closed",
  },
  Pending: {
    logo: <Activity size={18} className="text-[#E17100]" />,
    logoBgColor: "bg-[#FFFBEB]",
    drawerKey: "Pending",
  },    
  Unposted:{
    logo: <AlertTriangle size={18} className="text-[#F54900]" />,
    logoBgColor: "bg-[#FFF7ED]",
    drawerKey: "Unposted",
  }
}