import { X, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrgUnitFormData,
  orgUnitSchema,
} from "@/components/forms/validate.schema";
import apiClient from "@/services/apiClient";
import { getStates } from "@/services/location.service";

interface OrganizationUnit {
  id: number;
  organizationUnit: string;
  unitType: string;
  gstIn: string;
  manager: string;
  organizationGroupId: number;
  country: string;
  state: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  organizationGroup: {
    id: number;
    shortName: string;
  };
}

type Props = {
  editData: OrganizationUnit | null;
  loading: boolean;
  onClose: () => void;
  onSave: (data: OrgUnitFormData) => Promise<void>;
};

export function OrgUnitForm({ editData, loading, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrgUnitFormData>({
    resolver: zodResolver(orgUnitSchema),
    defaultValues: {
      name: "",
      type: "" as any,
      gstin: "",
      manager: "",
      group: "",
      country: "IN",
      state: "",
      address: "",
    },
  });

  const states = getStates("IN");
  const [groups, setGroups] = useState<
    { id: number; shortName: string; organizationGroup?: string }[]
  >([]);

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.organizationUnit,
        type: editData.unitType as OrgUnitFormData["type"],
        gstin: editData.gstIn,
        manager: editData.manager,
        group: String(editData.organizationGroupId),
        country: editData.country || "IN",
        state: editData.state,
        address: editData.address,
      });
    } else {
      reset({
        name: "",
        type: "" as any,
        gstin: "",
        manager: "",
        group: "",
        country: "IN",
        state: "",
        address: "",
      });
    }
  }, [editData, reset]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await apiClient.get("/api/organization/org-group");
        setGroups(res.data.data);
      } catch (err) {
        console.error("Failed to load org groups", err);
      }
    };

    fetchGroups();
  }, []);

  const onSubmit = async (data: OrgUnitFormData) => {
    try {
      await onSave({
        ...data,
        country: data.country || "IN",
        gstin: data.gstin.trim().toUpperCase(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#043793] focus:ring-1 focus:ring-[#043793] outline-none transition";
  const selectClass =
    "w-full h-10 px-3.5 pr-9 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm text-slate-800 focus:bg-white focus:border-[#043793] focus:ring-1 focus:ring-[#043793] outline-none transition appearance-none cursor-pointer";
  const textareaClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#043793] focus:ring-1 focus:ring-[#043793] outline-none transition resize-none";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";
  const errorClass = "text-xs text-rose-500 mt-1";

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#043793]">
              {editData ? "Edit Org Unit" : "Create Org Unit"}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Add a new branch, regional office, or HQ
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Form Body - Exact Row Order:
          Row 1: Unit Name * | Unit Type *
          Row 2: Org Group * | GSTIN *
          Row 3: Branch Manager | State
          Row 4: Address
      */}
      <div className="px-6 py-5 overflow-y-auto">
        <form id="org-unit-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Row 1, Col 1: Unit Name * */}
            <div>
              <label className={labelClass}>
                Unit Name <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("name")}
                className={`${inputClass} ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                    : ""
                }`}
                placeholder="e.g. Mumbai South"
              />
              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>

            {/* Row 1, Col 2: Unit Type * */}
            <div>
              <label className={labelClass}>
                Unit Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("type")}
                  defaultValue=""
                  className={`${selectClass} ${
                    errors.type
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Head Office / Branch…
                  </option>
                  <option value="Head Office">Head Office</option>
                  <option value="Branch">Branch</option>
                  <option value="Regional Office">Regional Office</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {errors.type && (
                <p className={errorClass}>{errors.type.message}</p>
              )}
            </div>

            {/* Row 2, Col 1: Org Group * */}
            <div>
              <label className={labelClass}>
                Org Group <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("group")}
                  defaultValue=""
                  className={`${selectClass} ${
                    errors.group
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select org group
                  </option>
                  {groups &&
                    groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.shortName}
                      </option>
                    ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {errors.group && (
                <p className={errorClass}>{errors.group.message}</p>
              )}
            </div>

            {/* Row 2, Col 2: GSTIN * */}
            <div>
              <label className={labelClass}>
                GSTIN <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("gstin")}
                maxLength={15}
                className={`${inputClass} font-mono uppercase ${
                  errors.gstin
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                    : ""
                }`}
                placeholder="27AABCS1429B1ZB"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              {errors.gstin && (
                <p className={errorClass}>{errors.gstin.message}</p>
              )}
            </div>

            {/* Row 3, Col 1: Branch Manager */}
            <div>
              <label className={labelClass}>Branch Manager</label>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  {...register("manager")}
                  className={`${inputClass} pl-9`}
                  placeholder="Search by name"
                />
              </div>
              {errors.manager && (
                <p className={errorClass}>{errors.manager.message}</p>
              )}
            </div>

            {/* Row 3, Col 2: State */}
            <div>
              <label className={labelClass}>State</label>
              <div className="relative">
                <select
                  {...register("state")}
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {errors.state && (
                <p className={errorClass}>{errors.state.message}</p>
              )}
            </div>

            {/* Row 4: Address (Full width) */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <textarea
                {...register("address")}
                rows={3}
                className={textareaClass}
                placeholder="Full address…"
              />
              {errors.address && (
                <p className={errorClass}>{errors.address.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="org-unit-form"
          disabled={loading}
          className="h-10 px-5 rounded-xl bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium hover:opacity-95 transition disabled:opacity-50 shadow-xs"
        >
          {loading ? "Saving..." : editData ? "Update Unit" : "Create Unit"}
        </button>
      </div>
    </>
  );
}
