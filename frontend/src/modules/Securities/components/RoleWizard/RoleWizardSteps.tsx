import { Check, FileText, Settings, Eye } from 'lucide-react';

interface Props{
    currentStep: number;
}

const steps=[
    {
        id:1,
        title: "Role Info",
        icon:FileText
    },
    {
        id:2,
        title: "Permissions",
        icon: Settings
    },
    {
        id:3,
        title: 'Review',
        icon: Eye
    }

]

function RoleWizardSteps({
    currentStep,
}:Props) {


  return (
    <div className="flex items-center justify-center gap-4">
        {steps.map((step,index)=>{
         const Icon = step.icon;
         const IsCompleted  = currentStep > step.id;
         const IsActive = currentStep === step.id;

         return(
            <div key={step.id} className='flex items-center' >
                <div className="flex items-center gap-2">
                    <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full

                        ${
                                IsCompleted
                                 ?'bg-green-500 text-white'
                                 :IsActive
                                 ? 'bg-[#043793] text-white'
                                 : 'bg-slate-100 text-slate-400'
                        }
                    `}
                    >
                            {IsCompleted ? (
                                 <Check size={16} />
                            ):(
                                <Icon size={16} />
                            )
                            }

                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Step {step.id }</p>
                            <p className={`text-sm font-medium${
                                IsActive
                            ? 'text-[#[#043793]'
                            : 'text-slate-400'
                            }`}
                            >
                                {step.title}
                            </p>
                        </div>
                    </div>
                                    {index < steps.length - 1 && (
              <div className="mx-5 h-px w-16 bg-slate-200" />
            )}
                </div>
         )


        })}
        </div>
  )
}

export default RoleWizardSteps