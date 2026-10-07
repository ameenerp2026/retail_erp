import { Check, Eye, FileText, Settings, type LucideIcon } from 'lucide-react'

interface Props {
  currentStep: number
  onStepClick?: (step: number) => void
}

interface StepItem {
  id: number
  title: string
  subtitle: string
  icon: LucideIcon
}

const steps: StepItem[] = [
  {
    id: 1,
    title: 'Role Information',
    subtitle: 'Name, access level & details',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Permission Matrix',
    subtitle: 'Module & action access',
    icon: Settings,
  },
  {
    id: 3,
    title: 'Review & Confirm',
    subtitle: 'Verify & activate role',
    icon: Eye,
  },
]

function RoleWizardSteps({ currentStep, onStepClick }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <nav aria-label="Role wizard progress" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <ol className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            const isClickable = Boolean(onStepClick && (isCompleted || isActive))

            return (
              <li
                key={step.id}
                className="flex items-center sm:flex-1 w-full sm:w-auto"
              >
                <div
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onStepClick?.(step.id)
                    }
                  }}
                  className={`flex items-center gap-3 w-full transition ${
                    isClickable ? 'cursor-pointer group' : 'cursor-default'
                  }`}
                >
                  {/* Step icon / badge */}
                  <div
                    aria-current={isActive ? 'step' : undefined}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-semibold text-sm transition-all shadow-xs ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isActive
                        ? 'border-[#043793] bg-[#043793] text-white ring-4 ring-blue-100'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} className="stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      <Icon size={18} aria-hidden="true" />
                    )}
                  </div>

                  {/* Step text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
                      Step {step.id}
                    </p>
                    <p
                      className={`text-sm font-semibold truncate transition-colors ${
                        isActive
                          ? 'text-[#043793]'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="hidden md:block text-xs text-slate-400 truncate">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Connecting divider line between steps */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`hidden sm:block mx-3 h-0.5 min-w-8 flex-1 rounded-full transition-colors ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export default RoleWizardSteps