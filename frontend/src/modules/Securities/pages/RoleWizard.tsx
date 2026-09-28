 import {useState} from 'react'
 import RoleWizardSteps from '../components/RoleWizard/RoleWizardSteps'
 import RoleInformation from '../components/RoleWizard/RoleInformation'
import PermissionMatrix from '../components/RoleWizard/PermissionMatrix'
import ReviewConfirm from '../components/RoleWizard/ReviewConfirm'


export type AccessLevel =
  | "STANDARD"
  | "MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface RoleWizardData {
  roleName: string;
  description: string;
  accessLevel: AccessLevel;
  permissions: string[];
}

function RoleWizard() {
   const [currentStep, setCurrentStep] = useState(1);
   const [roleData, setRoleData] = useState<RoleWizardData>({
     roleName: '',
  description: '',
  accessLevel: 'STANDARD',
  permissions: []
   })


  const handleNext=()=>{
    setCurrentStep((prev)=>Math.min(prev+1,3))
    console.log('currentStep',currentStep)
    console.log('roleData',roleData)
  }

  const handleBack=()=>{
    setCurrentStep((prev)=>Math.max(prev-1,1))
  }

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#043793]">
          Role Wizard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new role with fine-grained permission control
        </p>
      </div>

      {/* Steps */}
      <RoleWizardSteps currentStep={currentStep} />

      <div className='mt-8 flex justify-center items-center'>
        {currentStep === 1 && (
          <RoleInformation 
          roledata={roleData}
          setRoleData={setRoleData}
          onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
           <PermissionMatrix 
          roledata={roleData}
          setRoleData={setRoleData}
          onNext={handleNext}
          onBack={handleBack}
          />
        )}

          {currentStep === 3 && (
           <ReviewConfirm 
          roledata={roleData}
          setRoleData={setRoleData}
          onNext={handleNext}
          onBack={handleBack}
          />
        )}
      </div>
      </div>
  )
}

export default RoleWizard