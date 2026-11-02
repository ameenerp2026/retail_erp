import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SecuritiesCard } from '../components/SecuritiesCard'
import {
  cloneRole,
  deleteRole,
  getRoleRequestError,
  getRoles,
} from '@/services/admin/securities/role.service'

function Roles() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const rolesQuery = useQuery({
    queryKey: ['security-roles'],
    queryFn: getRoles,
  })

  const handleClone = async (id: number) => {
    try {
      await cloneRole(id)
      await queryClient.invalidateQueries({ queryKey: ['security-roles'] })
      toast.success('Role cloned successfully')
    } catch (error) {
      toast.error(getRoleRequestError(error))
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete the role "${name}"?`)) return

    try {
      await deleteRole(id)
      await queryClient.invalidateQueries({ queryKey: ['security-roles'] })
      toast.success('Role deleted successfully')
    } catch (error) {
      toast.error(getRoleRequestError(error))
    }
  }




  return (
    <div className='page-shell'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Roles</h1>
          <p className='page-subtitle'>Manage user roles and permissions</p>
        </div>
        <button
          type='button'
          onClick={() => navigate('/securities/role-wizard')}
          className='page-actions flex cursor-pointer items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 py-2.5 text-sm font-medium text-white'
        >
          <span>+</span> Create Role
        </button>
      </div>

      {rolesQuery.isLoading ? (
        <p className='py-8 text-center text-sm text-slate-500'>Loading roles...</p>
      ) : rolesQuery.error ? (
        <p role='alert' className='py-8 text-center text-sm text-red-600'>
          Failed to load roles: {getRoleRequestError(rolesQuery.error)}
        </p>
      ) : rolesQuery.data?.length === 0 ? (
        <p className='py-8 text-center text-sm text-slate-500'>
          No roles have been created yet.
        </p>
      ) : (
        <div className='grid w-full grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3'>
          {rolesQuery.data?.map((role) => (
            <SecuritiesCard
              key={role.id}
              id={role.id}
              roleName={role.name}
              roleType={role.roleType.replace('_', ' ')}
              description={role.description ?? ''}
              userCount={role.userCount}
              permissionCount={role.permissionCount}
              status={role.status}
              createdAt={role.createdAt}
              updatedAt={role.updatedAt}
              actions={{
                onEdit: () => navigate(`/securities/role-wizard/${role.id}`),
                onClone: () => void handleClone(role.id),
                onDelete: () => void handleDelete(role.id, role.name),
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Roles
