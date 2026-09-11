import React from 'react'

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
S
]

function RoleWizardSteps({
    currentStep,
}:Props) {


  return (
    <div>Role Wizard</div>
    // <div>
    //     {steps.map((step,index)=>{
    //      const Icon = step.icon;
    //      const IsCompleted  = currentStep > step.id;
    //      const IsActive = currentStep === step.id;

    //      return(
    //         <div key={step.id} >
    //             <div>
    //                 <div
    //                 className={`

    //                     ${

    //                     }
    //                 `}
    //                 >


    //                     </div>

    //                 </div>

    //             </div>
    //      )


    //     }}
    //     </div>
  )
}

export default RoleWizardSteps