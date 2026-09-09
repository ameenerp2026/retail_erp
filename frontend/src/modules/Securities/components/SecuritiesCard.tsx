import {
  Shield,
  Users,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

import { getRoleColor } from "../../../utils/RoleTheme";

interface CardActions {
  onEdit?: () => void;
  onDelete?: () => void;
  onClone?: () => void;
}

interface SecurityCardProps {
  id?: number;
  roleName: string;
  roleType: string;
  description: string;
  userCount: number;
  permissionCount: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  color?: string;
  actions?: CardActions;
}

export function SecuritiesCard({
  roleName,
  roleType,
  description,
  userCount,
  permissionCount,
  actions,
}: SecurityCardProps) {
  const primaryColor = getRoleColor(roleName);

  return (
    <div
      className="flex min-h-[240px] w-full flex-col
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          <Shield size={24} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#043793]">{roleName}</h3>
          <span
            className="text-medium rounded font-semibold px-2 py-0.5"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            {roleType}
          </span>
        </div>
      </div>
      <p className="text-sm text-[#6B7280] mt-3">{description}</p>

      <div className="flex gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <Users size={13} color={"#6B7280"} />
          <span className="text-sm text-[#6B7280]">{userCount} Users</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield size={13} color={"#6B7280"} />
          <span className="text-sm text-[#6B7280]">
            {permissionCount} Permissions
          </span>
        </div>
      </div>

      <div className="mx-4 border-t border-slate-200 mt-auto">
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            type="button"
            onClick={actions?.onEdit}
            className="flex items-center h-9 px-3 rounded gap-2 text-sm text-blue-500 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
          >
            <Pencil size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={actions?.onClone}
            className="flex items-center h-9 px-3 rounded gap-2 bg-green-50 text-sm text-green-500 hover:bg-green-100 transition cursor-pointer"
          >
            <Copy size={13} />
            Clone
          </button>

          <button
            type="button"
            onClick={actions?.onDelete}
            className="flex items-center h-9 px-3 rounded gap-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 transition cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
