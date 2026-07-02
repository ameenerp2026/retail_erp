import { Calendar,Lock,Clock,CreditCard } from 'lucide-react'
import { FinanceStatType } from '@/types/finance'

type CardConfig = {
  logo: React.ReactNode
  logoBgColor: string
 }

export const CARD_CONFIG: Record<FinanceStatType, CardConfig> = {
  open: {
    logo: <Calendar size={18} className="text-[#155DFC]" />,
    logoBgColor: "bg-blue-50",
    },
  closed: {
    logo: <Lock size={18} className="text-[#E7000B]" />,
    logoBgColor: "bg-red-50",
    },
  provisional: {
   logo: <Clock size={18} className="text-[#E17100]"/>,
    logoBgColor: 'bg-orange-50', 
    },
  pending: {
    logo: <CreditCard size={18} className="text-[#7F22FE]" />,
    logoBgColor: "bg-purple-50",
    }
}