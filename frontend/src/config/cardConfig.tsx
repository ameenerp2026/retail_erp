import { Calendar, Lock, Unlock, TrendingUp } from 'lucide-react'
import type { FinanceStatType } from '@/types/finance'

type CardConfig = {
  logo: React.ReactNode
  logoBgColor: string
  valueColor: string
}

export const CARD_CONFIG: Record<FinanceStatType, CardConfig> = {
  activeFy: {
    logo: <Calendar size={18} className="text-[#0B4D8C]" />,
    logoBgColor: 'bg-[rgba(11,77,140,0.09)]',
    valueColor: 'text-[#0B4D8C]',
  },
  open: {
    logo: <Unlock size={18} className="text-[#22C55E]" />,
    logoBgColor: 'bg-[rgba(34,197,94,0.09)]',
    valueColor: 'text-[#22C55E]',
  },
  closed: {
    logo: <Lock size={18} className="text-[#EF4444]" />,
    logoBgColor: 'bg-[rgba(239,68,68,0.09)]',
    valueColor: 'text-[#EF4444]',
  },
  entries: {
    logo: <TrendingUp size={18} className="text-[#14B8A6]" />,
    logoBgColor: 'bg-[rgba(20,184,166,0.09)]',
    valueColor: 'text-[#14B8A6]',
  },
}
