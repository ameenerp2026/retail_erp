import { Loader2, Check } from 'lucide-react'

interface DocumentGeneratingViewProps {
  title: string
  subtitle: string
  steps: string[]
  stepIndex: number
}

export default function DocumentGeneratingView({ title, subtitle, steps, stepIndex }: DocumentGeneratingViewProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-center">
      <Loader2 size={32} className="animate-spin text-[#0aa6a6]" />
      <p className="mt-2 text-sm font-semibold text-[#043793]">{title}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
      <ul className="mt-3 space-y-1.5 text-left">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2 text-xs">
            {i < stepIndex ? (
              <Check size={13} className="shrink-0 text-emerald-500" />
            ) : i === stepIndex ? (
              <Loader2 size={13} className="shrink-0 animate-spin text-[#0aa6a6]" />
            ) : (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-200" />
            )}
            <span className={i <= stepIndex ? 'text-slate-600' : 'text-slate-300'}>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}