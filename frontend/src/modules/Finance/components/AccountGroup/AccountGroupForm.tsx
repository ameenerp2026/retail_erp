import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { accountGroupSchema, type AccountGroupFormData } from '@/components/forms/validate.schema'
import FormInput from '@/components/forms/FormInput'
import { accountGroupService } from '@/services/admin/finance/accountGroupService'
import { useQuery,useQueryClient  } from '@tanstack/react-query'
import { useEffect } from 'react'
import axios from 'axios'

type Props = {
  onClose: () => void;
   groups: {
    id: number;
    groupName: string;
  }[];
}

export default function AccountGroupForm({ onClose,groups}: Props) {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountGroupFormData>({
    resolver: zodResolver(accountGroupSchema),
    defaultValues: {
        rootGroupName:'',
    },
  })
  
  // watch the selected group so Sub Group options can filter live
  const selectedGroupId = useWatch({ control, name: 'groupId' })
  useEffect(() => {
  setValue("subGroupId", undefined as unknown as number);
}, [selectedGroupId, setValue]);
  const { data: subGroups = [] } = useQuery({
  queryKey: ["sub-groups", selectedGroupId],
  queryFn: () => accountGroupService.getSubGroups(Number(selectedGroupId)),
  enabled: !!selectedGroupId,
});
const subGroupOptions = subGroups.map((sg) => ({
  value: String(sg.id),
  label: sg.subGroupName,
}));
  
  async function onSubmit(data: AccountGroupFormData) {
  try {
    await accountGroupService.create(data)
    toast.success('Account group created successfully!')
    queryClient.invalidateQueries({ queryKey: ['account-groups'] })
    onClose()
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ?? 'Something went wrong. Please try again.'
      : 'Something went wrong. Please try again.'
    toast.error(message)
  }
}

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-[512px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-4 pb-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#043793]">
                Add Root Group
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          id="account-group-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 space-y-5 overflow-y-auto"
        >
            <div className="grid grid-cols-2 gap-5">
                {/* Group name */}
          <FormInput
              label="Group"
              type="select"
              required
              options={groups.map((g) => ({ value: String(g.id), label: g.groupName }))}
              error={errors.groupId?.message}
              {...register('groupId', {
                valueAsNumber: true,
                onChange: () => setValue('subGroupId', undefined as unknown as number),
              })}
            />

          {/* Sub Group select — filtered by selected Group */}
            <FormInput
              label="Sub Group"
              type="select"
              required
              disabled={!selectedGroupId}
              options={subGroupOptions}
              error={errors.subGroupId?.message}
              {...register('subGroupId', { valueAsNumber: true })}
            />
            </div>
          {/* Root group name */}
          <FormInput
            label="Root Group Name"
            placeholder="Enter root group name"
            error={errors.rootGroupName?.message}
            {...register('rootGroupName')}
          />
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="account-group-form"
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Root'}
          </button>
        </div>

      </div>
    </div>
  )
}