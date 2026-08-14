import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';

type AccountGroupOption = { id: number; label: string }

export const useAccountGroups = () => {
  const [options, setOptions] = useState<AccountGroupOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/account-groups/active')
      .then(res => res.json())
      .then(data => { if (!cancelled) setOptions(data) })
      .catch(() => toast.error('Failed to load account groups'))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { options, loading }
}