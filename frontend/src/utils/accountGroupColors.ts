// utils/accountGroupColors.ts

// Fixed palette — extend as needed. Using deterministic hashing so the same
// group always gets the same color across sessions/reloads (no randomness).
const COLOR_PALETTE = [
  { bg: 'bg-blue-500',    bgLight: 'bg-blue-100' },
  { bg: 'bg-green-500',   bgLight: 'bg-green-100' },
  { bg: 'bg-purple-500',  bgLight: 'bg-purple-100' },
  { bg: 'bg-amber-500',   bgLight: 'bg-amber-100' },
  { bg: 'bg-rose-500',    bgLight: 'bg-rose-100' },
  { bg: 'bg-cyan-500',    bgLight: 'bg-cyan-100' },
  { bg: 'bg-indigo-500',  bgLight: 'bg-indigo-100' },
  { bg: 'bg-teal-500',    bgLight: 'bg-teal-100' },
] as const

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // force 32-bit int
  }
  return Math.abs(hash)
}

export function getGroupColor(groupName: string) {
  const index = hashString(groupName) % COLOR_PALETTE.length
  return COLOR_PALETTE[index]
}