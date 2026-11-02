import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import RoleWizardSteps from '../components/RoleWizard/RoleWizardSteps'
import RoleInformation from '../components/RoleWizard/RoleInformation'
import PermissionMatrix from '../components/RoleWizard/PermissionMatrix'
import ReviewConfirm from '../components/RoleWizard/ReviewConfirm'
import {
  createRole,
  getOrganizationGroups,
  getRoleById,
  getRolePermissions,
  getRoleRequestError,
  updateRole,
  type RolePayload,
  type RolePermission,
  type RoleScope,
  type SecurityRole,
  type OrganizationGroupOption,
} from '@/services/admin/securities/role.service'

export type AccessLevel = 'STANDARD' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN'

export interface RoleWizardData {
  roleName: string
  description: string
  accessLevel: AccessLevel
  organizationGroupId: number
  scope: RoleScope
  permissions: number[]
}

const rolePriorities: Record<AccessLevel, number> = {
  STANDARD: 1,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
}

function RoleWizard() {
  const { id: roleIdParam } = useParams()
  const roleId = roleIdParam ? Number(roleIdParam) : undefined
  const isInvalidRoleId =
    !!roleIdParam &&
    (!roleId || !Number.isInteger(roleId) || roleId < 1)
  const roleQuery = useQuery({
    queryKey: ['security-role', roleId],
    queryFn: () => getRoleById(roleId!),
    enabled: roleId !== undefined && Number.isInteger(roleId) && roleId > 0,
  })
  const groupsQuery = useQuery({
    queryKey: ['organization-groups'],
    queryFn: getOrganizationGroups,
  })
  const permissionsQuery = useQuery({
    queryKey: ['role-permissions'],
    queryFn: getRolePermissions,
  })

  if (isInvalidRoleId) {
    return <div role='alert' className='page-shell text-red-600'>Invalid role ID.</div>
  }

  if (roleId && roleQuery.isLoading) {
    return <div className='page-shell'>Loading role...</div>
  }

  if (roleQuery.error) {
    return (
      <div role='alert' className='page-shell text-red-600'>
        Failed to load role: {getRoleRequestError(roleQuery.error)}
      </div>
    )
  }

  return (
    <RoleWizardForm
      key={roleId ?? 'new'}
      role={roleQuery.data}
      organizationGroups={groupsQuery.data ?? []}
      groupsLoading={groupsQuery.isLoading}
      groupsError={
        groupsQuery.error
          ? getRoleRequestError(groupsQuery.error)
          : undefined
      }
      permissions={permissionsQuery.data ?? []}
      permissionsLoading={permissionsQuery.isLoading}
      permissionsError={
        permissionsQuery.error
          ? getRoleRequestError(permissionsQuery.error)
          : undefined
      }
    />
  )
}

interface RoleWizardFormProps {
  role?: SecurityRole
  organizationGroups: OrganizationGroupOption[]
  groupsLoading: boolean
  groupsError?: string
  permissions: RolePermission[]
  permissionsLoading: boolean
  permissionsError?: string
}

function RoleWizardForm({
  role,
  organizationGroups,
  groupsLoading,
  groupsError,
  permissions,
  permissionsLoading,
  permissionsError,
}: RoleWizardFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [roleData, setRoleData] = useState<RoleWizardData>(() => ({
    roleName: role?.name ?? '',
    description: role?.description ?? '',
    accessLevel: role?.roleType ?? 'STANDARD',
    organizationGroupId: role?.organizationGroupId ?? 0,
    scope: role?.scope ?? 'GROUP',
    permissions: role?.permissionIds ?? [],
  }))
  const [submitError, setSubmitError] = useState<string>()
  const [saving, setSaving] = useState(false)

  const handleNext = () => {
    setSubmitError(undefined)
    setCurrentStep((previous) => Math.min(previous + 1, 3))
  }

  const handleBack = () => {
    setSubmitError(undefined)
    setCurrentStep((previous) => Math.max(previous - 1, 1))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setSubmitError(undefined)
    const payload: RolePayload = {
      name: roleData.roleName.trim(),
      description: roleData.description,
      roleType: roleData.accessLevel,
      scope: roleData.scope,
      priority: role?.priority ?? rolePriorities[roleData.accessLevel],
      status: role?.status ?? 'ACTIVE',
      organizationGroupId: roleData.organizationGroupId,
      permissionIds: roleData.permissions,
    }

    try {
      if (role) {
        await updateRole(role.id, payload)
        toast.success('Role updated successfully')
      } else {
        await createRole(payload)
        toast.success('Role created successfully')
      }
      await queryClient.invalidateQueries({ queryKey: ['security-roles'] })
      navigate('/securities/roles')
    } catch (error) {
      const message = getRoleRequestError(error)
      setSubmitError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='page-shell'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-[#043793]'>
          {role ? 'Edit Role' : 'Role Wizard'}
        </h1>
        <p className='mt-1 text-sm text-slate-500'>
          {role
            ? 'Update role details and permissions'
            : 'Create a new role with fine-grained permission control'}
        </p>
      </div>

      <RoleWizardSteps currentStep={currentStep} />

      <div className='mt-8 flex items-center justify-center'>
        {currentStep === 1 && (
          <RoleInformation
            roledata={roleData}
            setRoleData={setRoleData}
            onNext={handleNext}
            onCancel={() => navigate('/securities/roles')}
            organizationGroups={organizationGroups}
            groupsLoading={groupsLoading}
            groupsError={groupsError}
          />
        )}

        {currentStep === 2 && (
          <PermissionMatrix
            roledata={roleData}
            setRoleData={setRoleData}
            onNext={handleNext}
            onBack={handleBack}
            permissions={permissions}
            loading={permissionsLoading}
            error={permissionsError}
          />
        )}

        {currentStep === 3 && (
          <ReviewConfirm
            roledata={roleData}
            onNext={handleSubmit}
            onBack={handleBack}
            onEditInformation={() => setCurrentStep(1)}
            saving={saving}
            submitLabel={role ? 'Save Changes' : 'Create Role'}
            error={submitError}
            permissions={permissions}
            organizationGroups={organizationGroups}
          />
        )}
      </div>
    </div>
  )
}

export default RoleWizard
