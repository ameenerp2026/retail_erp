// components/shared/StatCards.tsx
import Card from '@/components/shared/Card'

type StatCardItem = {
  id: string | number
  label: string
  count: number | string
  logo: React.ReactNode
  logoBgColor: string
  drawerKey?: string
}

type StatCardsProps = {
  cards: StatCardItem[]
  onCardClick?: (key: string) => void 
}

export default function StatCards({ cards, onCardClick }: StatCardsProps) {
  if (!cards.length) return null

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => card.drawerKey && onCardClick?.(card.drawerKey)}
          className={card.drawerKey ? 'cursor-pointer' : ''}  // ← pointer only if clickable
        >
        <Card
          key={card.id}
          icon={card.logo}
          iconBgColor={card.logoBgColor}
          title={card.label}
          count={card.count}
        />
        </div>
      ))}
    </div>
  )
}

export type { StatCardItem }