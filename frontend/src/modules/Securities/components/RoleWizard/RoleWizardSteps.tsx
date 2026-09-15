import { Check, Eye, FileText, Settings, type LucideIcon } from 'lucide-react'

interface Props {
    currentStep: number
}

const steps: { id: number; title: string; icon: LucideIcon }[] = [
    {
        id: 1,
        title: 'Role Info',
        icon: FileText,
    },
    {
        id: 2,
        title: 'Permissions',
        icon: Settings,
    },
    {
        id: 3,
        title: 'Review',
        icon: Eye,
    },
]

function RoleWizardSteps({ currentStep }: Props) {
  return (
        <nav aria-label="Role wizard progress" className="w-full">
            <ol className="flex items-start">
                {steps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = currentStep > step.id
                    const isActive = currentStep === step.id

                    return (
                        <li key={step.id} className="flex min-w-0 flex-1 items-start">
                            <div className="flex min-w-0 flex-col items-center text-center">
                                <div
                                    aria-current={isActive ? 'step' : undefined}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                                        isCompleted
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : isActive
                                                ? 'border-[#043793] bg-[#043793] text-white'
                                                : 'border-slate-200 bg-white text-slate-400'
                                    }`}
                                >
                                    {isCompleted ? <Check size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-semibold ${
                                        isActive || isCompleted ? 'text-[#043793]' : 'text-slate-400'
                                    }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    aria-hidden="true"
                                    className={`mt-5 h-0.5 min-w-4 flex-1 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                />
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
  )
}

export default RoleWizardSteps