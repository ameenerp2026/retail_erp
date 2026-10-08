import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { InventoryConfigCard } from '@/types/inventorySetup'
import TabToolbar from '../shared/TabToolbar'
import { Toggle } from '../shared/formControls'

function ConfigCard({
  card,
  onToggle,
}: {
  card: InventoryConfigCard
  onToggle: (cardId: string, itemId: string) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-[#043793]">{card.title}</h3>
      <p className="mt-0.5 text-xs text-slate-400">{card.description}</p>

      <div className="mt-4 divide-y divide-slate-50">
        {card.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#314158]">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-400">{item.description}</p>
            </div>
            <Toggle checked={item.enabled} onChange={() => onToggle(card.id, item.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InventoryConfigTab() {
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-config'],
    queryFn: inventorySetupService.getInventoryConfig,
  })

  const [localCards, setLocalCards] = useState<InventoryConfigCard[]>([])
  const [initialized, setInitialized] = useState(false)

  if (!initialized && cards.length > 0) {
    setLocalCards(cards)
    setInitialized(true)
  }

  const handleToggle = (cardId: string, itemId: string) => {
    setLocalCards((prev) =>
      prev.map((c) =>
        c.id !== cardId
          ? c
          : {
              ...c,
              items: c.items.map((it) => (it.id === itemId ? { ...it, enabled: !it.enabled } : it)),
            }
      )
    )
  }

  return (
    <div>
      <TabToolbar title="Inventory Configuration" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-50" />
          <div className="h-72 animate-pulse rounded-2xl bg-slate-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(localCards.length ? localCards : cards).map((card) => (
            <ConfigCard key={card.id} card={card} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  )
}
