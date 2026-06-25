import Card from '@/components/shared/Card'
import { FinanceStat } from '@/types/finance'
import { CARD_CONFIG } from '../../config/cardConfig'

type StatCardsProps = {
  stats: FinanceStat[]
}

export function StatCards({ stats = [] }: StatCardsProps) {
    console.log(stats);
    
    if (!stats.length) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
      {stats.map((stat) => {
        const config = CARD_CONFIG[stat.type]
        return (
          <Card 
            key={stat.id}
            icon={config.logo}
            iconBgColor={config.logoBgColor}
            title={stat.label}
            count={stat.count}
          />
        )
      })}
    </div>
  )
}