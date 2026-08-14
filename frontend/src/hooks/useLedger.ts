// hooks/useLedger.ts
import { useQuery } from '@tanstack/react-query'
import { ledgerService } from '@/services/admin/finance/ledgerService'

export const useAccountClassesByGroup = (accountGroupId: number | null) => {
  return useQuery({
    queryKey: ['account-classes', 'by-group', accountGroupId],
    queryFn: () => ledgerService.getAccountClassesByGroup(accountGroupId!),
    enabled: !!accountGroupId,   // don't fetch until a group is actually selected
  })
}