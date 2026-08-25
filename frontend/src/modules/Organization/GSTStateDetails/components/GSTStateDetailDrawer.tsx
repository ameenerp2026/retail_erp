import Drawer from '@/components/shared/Drawer'
import DetailInfoCard from '@/components/shared/DetailInfoCard'
import EmptyState from '@/components/shared/EmptyState'
import type { GSTStateRecord } from '@/types/gstState'
import { useQuery } from '@tanstack/react-query'
import { getLinkedStores } from '@/services/admin/organization/gstState.service'

type GSTStateDetailDrawerProps = {
  isOpen: boolean
  onClose: () => void
  state: GSTStateRecord | null
}

export default function GSTStateDetailDrawer({
  isOpen,
  onClose,
  state,
}: GSTStateDetailDrawerProps) {
  const { data: linkedStores = [] } = useQuery({
    queryKey: ['linked-stores', state?.id],
    queryFn: () => getLinkedStores(state!.id),
    enabled: isOpen && !!state?.id,
  })

  if (!state) return null

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="sm" title="">
      <div className="-mt-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
            {state.code}
          </span>
          <h2 className="text-lg font-bold text-slate-800">{state.stateName}</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {state.linkedGstins} registered GSTINs
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <DetailInfoCard label="IGST" value={state.igst ? "Enabled" : "Disabled"} valueColor={state.igst ? "text-green-600" : "text-slate-400"} />
        <DetailInfoCard label="CGST + SGST" value={state.cgstSgst ? "Enabled" : "Disabled"} valueColor={state.cgstSgst ? "text-[#22C55E]" : "text-[#9CA3AF]"} />
        <DetailInfoCard label="SEZ Zone" value={state.sez ? "Enabled" : "Disabled"} valueColor={state.sez ? "text-[#F59E0B]" : "text-[#9CA3AF]"} />
        <DetailInfoCard label="IGST Only (UT)" value="Disabled" valueColor="text-slate-400" />
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#043793] mb-3">Linked Stores</h3>

        {linkedStores.length === 0 ? (
          <EmptyState
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M28.7048 19.9897H22.6545C21.9477 19.9897 21.2697 20.2706 20.7699 20.7704C20.2701 21.2702 19.9893 21.9482 19.9893 22.655V28.7053" stroke="#9CA3AF" strokeWidth="2.66529" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.32812 4.45105V6.66324C9.32812 7.72356 9.74934 8.74045 10.4991 9.49021C11.2489 10.24 12.2657 10.6612 13.3261 10.6612C14.0329 10.6612 14.7109 10.942 15.2107 11.4418C15.7105 11.9417 15.9914 12.6196 15.9914 13.3265C15.9914 14.7924 17.1907 15.9918 18.6566 15.9918C19.3635 15.9918 20.0415 15.711 20.5413 15.2111C21.0411 14.7113 21.3219 14.0333 21.3219 13.3265C21.3219 11.8606 22.5213 10.6612 23.9872 10.6612H28.2117" stroke="#9CA3AF" strokeWidth="2.66529" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.6586 29.2515V23.9876C14.6586 23.2807 14.3778 22.6028 13.878 22.1029C13.3781 21.6031 12.7002 21.3223 11.9933 21.3223C11.2865 21.3223 10.6085 21.0415 10.1087 20.5416C9.60885 20.0418 9.32804 19.3639 9.32804 18.657V17.3243C9.32804 16.6175 9.04724 15.9395 8.5474 15.4397C8.04756 14.9399 7.36963 14.6591 6.66275 14.6591H2.73145" stroke="#9CA3AF" strokeWidth="2.66529" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.9915 29.3182C23.3515 29.3182 29.318 23.3517 29.318 15.9917C29.318 8.63174 23.3515 2.66528 15.9915 2.66528C8.6315 2.66528 2.66504 8.63174 2.66504 15.9917C2.66504 23.3517 8.6315 29.3182 15.9915 29.3182Z" stroke="#9CA3AF" strokeWidth="2.66529" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
            message="No stores linked to this state"
          />
        ) : (
          <div className="space-y-3">
            {linkedStores.map((store) => (
              <div key={store.id} className="text-sm text-slate-700">
                {store.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  )
}