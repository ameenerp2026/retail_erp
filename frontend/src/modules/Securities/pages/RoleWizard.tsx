import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import RoleWizardSteps from '../components/RoleWizard/RoleWizardSteps'
import RoleInformation from '../components/RoleWizard/RoleInformation'
import PermissionMatrix from '../components/RoleWizard/PermissionMatrix'
import ReviewConfirm from '../components/RoleWizard/ReviewConfirm'

export type AccessLevel =
  | 'STANDARD'
  | 'MANAGER'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export interface RoleWizardData {
  roleName: string
  description: string
  accessLevel: AccessLevel
  permissions: string[]
}

function RoleWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [roleData, setRoleData] = useState<RoleWizardData>({
    roleName: '',
    description: '',
    accessLevel: 'STANDARD',
    permissions: [],
  })

  const handleNext = () => {
    if (currentStep === 1) {
      if (!roleData.roleName.trim()) {
        toast.error('Please enter a Role Name.')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      // Finalize and save role
      toast.success(`Role "${roleData.roleName}" created successfully!`)
      navigate('/securities/roles')
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/securities/roles')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Back to roles"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="page-title text-[#043793]">
              Role Wizard
            </h1>
            <p className="page-subtitle text-slate-500">
              Create a new role with fine-grained permission control
            </p>
          </div>
        </div>

        <div className="page-actions">
          <button
            type="button"
            onClick={() => navigate('/securities/roles')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Exit Wizard
          </button>
        </div>
      </div>

      {/* Stepper */}
      <RoleWizardSteps
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step > 1 && !roleData.roleName.trim()) {
            toast.error('Please enter a role name before proceeding.')
            return
          }
          setCurrentStep(step)
        }}
      />

      {/* Step Content */}
      <div className="w-full">
        {currentStep === 1 && (
          <RoleInformation
            roledata={roleData}
            setRoleData={setRoleData}
            onNext={handleNext}
            onCancel={() => navigate('/securities/roles')}
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
            onEditSection={(step) => setCurrentStep(step)}
          />
        )}
      </div>
    </div>
  )
}

export default RoleWizard