import { MODULE_ROUTES } from "@/config/navigationConfig";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col
        bg-[#043793] text-white
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col px-4 pt-4 pb-4">
        {/* Brand */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A3A7A] text-lg font-bold text-white">
              S
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold leading-tight tracking-tight text-white">
                STREAMYS
              </h2>
              <p className="text-[10px] font-medium tracking-[0.18em] text-[#5B8BC6]">
                RETAIL SAAS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-3 h-px bg-[#5B8BC6]/60" />

        {/* Tenant */}
        <div className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#2B4B8C] bg-[#1A3A7A] p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80] text-sm font-bold text-[#0B2A6B]">
              RS
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                RetailShop India
              </p>
              <p className="text-xs text-[#8FA8D4]">Admin Tenant</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-4">
          {MODULE_ROUTES.map((module) => {
            const Icon = module.icon;
            const isActive = location.pathname.startsWith(module.basePath);

            return (
              <NavLink
                key={module.label}
                to={
                  module.tabs?.length
                    ? `${module.basePath}/${module.tabs[0].path}`
                    : module.basePath
                }
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-[#2B6CB0] to-[#1A4A8A] text-white shadow-sm"
                    : "text-white/90 hover:bg-[#1A3A7A]"
                }`}
              >
                <Icon size={18} className="shrink-0 opacity-90" />
                <span className="truncate">{module.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mb-3 h-px bg-[#5B8BC6]/60" />

        {/* User */}
        <div className="mb-3 flex w-full items-center justify-between rounded-xl border border-[#2B4B8C]/40 bg-[#1A3A7A]/60 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2B4B8C] text-sm font-bold text-white">
              AD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Admin User
              </p>
              <p className="truncate text-xs text-[#8FA8D4]">
                admin@streamys.in
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-lg p-1.5 text-white/80 hover:bg-white/10"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
