import { Search, Plus, Moon, Bell, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { MODULE_ROUTES } from "@/config/navigationConfig";

type TopbarProps = {
  onMenuClick?: () => void;
};

function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const activeModule = MODULE_ROUTES.find((module) =>
    location.pathname.startsWith(module.basePath)
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="truncate text-sm font-semibold tracking-tight text-[#043793] sm:text-base">
            {activeModule?.label ?? "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden h-10 w-44 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex lg:w-64 xl:w-72">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search modules, records..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-3 text-sm font-medium text-white transition hover:opacity-95 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Quick Create</span>
          </button>

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200 sm:flex"
            aria-label="Toggle theme"
          >
            <Moon size={18} className="text-slate-600" />
          </button>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {activeModule?.tabs && activeModule.tabs.length > 0 && (
        <div className="border-t border-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 scrollbar-none sm:gap-6">
            {activeModule.tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${activeModule.basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap border-b-2 px-2 py-3 text-sm font-medium transition sm:px-0 ${
                    isActive
                      ? "border-[#043793] text-[#043793]"
                      : "border-transparent text-slate-500 hover:text-[#043793]"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Topbar;
