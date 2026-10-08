import { MODULE_ROUTES } from "@/config/navigationConfig";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronsUpDown, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const displayName = user?.name ?? "Admin User";
  const displayRole = user?.role ?? "Admin";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-60 flex-col
        bg-[#043793] text-white
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col px-3 pt-4 pb-4">
        {/* Brand */}
        <div className="mb-4 flex items-center justify-between gap-3 px-1.5">
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

        {/* Tenant card */}
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-[#2B4B8C] bg-[#1A3A7A] p-3 text-left transition hover:bg-[#20447F]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80] text-sm font-bold text-[#0B2A6B]">
              RS
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                RetailShop India
              </p>
              <p className="truncate text-xs text-[#8FA8D4]">Admin Tenant</p>
            </div>
          </div>
          <ChevronDown size={16} className="shrink-0 text-[#8FA8D4]" />
        </button>

        {/* Nav */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-4">
          {MODULE_ROUTES.map((module) => {
            const Icon = module.icon;
            const isActive = location.pathname.startsWith(module.basePath);
            const firstPath = module.tabs?.length
              ? `${module.basePath}/${module.tabs[0].path}`
              : module.basePath;

            return (
              <div key={module.label}>
                <NavLink
                  to={firstPath}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1A3A7A] text-white"
                      : "text-white/85 hover:bg-[#1A3A7A]/60"
                  }`}
                >
                  <Icon size={18} className="shrink-0 opacity-90" />
                  <span className="truncate">{module.label}</span>
                </NavLink>

                {isActive && module.tabs && module.tabs.length > 0 && (
                  <div className="ml-4 mt-1 mb-1 space-y-0.5 border-l border-white/15 pl-3">
                    {module.tabs.map((tab) => (
                      <NavLink
                        key={tab.path}
                        to={`${module.basePath}/${tab.path}`}
                        onClick={onClose}
                        className={({ isActive: tabActive }) =>
                          `block truncate rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                            tabActive
                              ? "bg-white/10 font-semibold text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`
                        }
                      >
                        {tab.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-[#2B4B8C]/40 bg-[#1A3A7A]/60 p-3 text-left transition hover:bg-[#1A3A7A]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2B4B8C] text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-[#8FA8D4]">{displayRole}</p>
            </div>
          </div>
          <ChevronsUpDown size={16} className="shrink-0 text-[#8FA8D4]" />
        </button>
      </div>
    </aside>
  );
}
