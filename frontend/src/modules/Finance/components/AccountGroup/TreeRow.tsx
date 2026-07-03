import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { AccountGroupNode } from '@/types/accountGroup'

// Color per level — matches Figma dots
const LEVEL_STYLES = {
  1: { text: 'text-[#0B4D8C]',  font: 'font-bold  text-sm'  },
  2: { text: 'text-[#21B6A8]',  font: 'font-medium text-sm' },
  3: { text: 'text-[#4FC3F7]',  font: 'font-normal text-sm' },
}

const INDENT = {
  1: 'pl-0',
  2: 'pl-6',
  3: 'pl-12',
}

type TreeRowProps = {
  node: AccountGroupNode
}

export default function TreeRow({ node }: TreeRowProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  const styles = LEVEL_STYLES[node.level]
console.log(styles)
  return (
    <div>
      {/* Row */}
      <div className={`flex items-center gap-2 py-2 px-4 hover:bg-slate-50 ${INDENT[node.level]}`}>

        {/* Expand/collapse chevron */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-4 h-4 flex items-center justify-center text-slate-400 flex-shrink-0"
        >
          {hasChildren ? (
            expanded
              ? <ChevronDown size={13} />
              : <ChevronRight size={13} />
          ) : (
            <span className="w-4" /> // spacer
          )}
        </button>

        {/* Name */}
        <span className={`${styles.text} ${styles.font}`}>
          {node.name}
        </span>

        {/* Code badge */}
        <span className="text-[10px] text-slate-400 font-mono ml-1">
          {node.code}
        </span>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeRow key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}