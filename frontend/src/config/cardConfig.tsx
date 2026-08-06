import { Calendar, Lock, TrendingUp, Clock } from 'lucide-react'
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
    logo: <Calendar size={18} className="text-[#2B7FFF]" />,
    logoBgColor: 'bg-[rgba(43,127,255,0.09)]',
    valueColor: 'text-[#1A2332]',
  },
  closed: {
    logo: <Lock size={18} className="text-[#EF4444]" />,
    logoBgColor: 'bg-[rgba(239,68,68,0.09)]',
    valueColor: 'text-[#1A2332]',
  },
  provisional: {
    logo: <Clock size={18} className="text-[#FE9A00]" />,
    logoBgColor: 'bg-[rgba(254,154,0,0.09)]',
    valueColor: 'text-[#1A2332]',
  },
  entries: {
    logo: <TrendingUp size={18} className="text-[#14B8A6]" />,
    logoBgColor: 'bg-[rgba(20,184,166,0.09)]',
    valueColor: 'text-[#14B8A6]',
  },
}
