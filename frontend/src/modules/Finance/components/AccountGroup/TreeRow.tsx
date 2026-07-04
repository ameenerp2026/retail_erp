import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { AccountGroupNode } from '@/types/accountGroup'

// Color per level — matches Figma dots
const LEVEL_STYLES = {
  1: { chevron: "text-[#043793]",text: 'text-[#0B4D8C]',  font: 'font-bold  text-sm',circle: ""},
  2: { chevron: "text-[#21B6A8]",text: 'text-[#334155]',  font: 'font-medium text-sm',circle: "border-[#21B6A8]"},
  3: { chevron: "text-[#4FC3F7]",text: 'text-[#334155]',  font: 'font-normal text-sm',circle: "border-[#4FC3F7]"},
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

  return (
    <div>
      {/* Row */}
      <div className={`flex items-center gap-2 py-2 px-4 hover:bg-slate-50 ${INDENT[node.level]}`}>

        {/* Expand/collapse chevron */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-4 h-4 flex items-center justify-center ${styles.chevron} flex-shrink-0`}
        >
        {hasChildren ? (
           expanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )
          ) : (
            <span
              className={`w-3 h-3 rounded-full border-2 ${styles.circle}`}
            />
          )
        }
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