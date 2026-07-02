import { Search, Plus, Moon, Bell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { MODULE_ROUTES } from "@/config/navigationConfig";

function Topbar() {
  const location = useLocation();
  const activeModule = MODULE_ROUTES.find((module) =>
    location.pathname.startsWith(module.basePath)
  );
  return (
    <header
      className="fixed top-0 left-72 right-0 z-40 bg-white"
    >
    <div className="h-16 px-6 flex items-center justify-between">
      {/* Left Title */}
        <div>
          <h1 className="text-xl font-semibold text-[#043793]">
          {activeModule?.label ?? "Dashboard"}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="w-[280px] h-16 rounded-xl border border-slate-200 bg-slate-50 px-3 flex items-center gap-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search modules, records..."
              className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Create Button */}
          <button className="h-10 px-4 rounded-xl bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={18} />
          Quick Create
          </button>

          {/* Theme Button */}
          <button className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <Moon size={18} className="text-slate-600" />
          </button>

          {/* Notification Button */}
          <button className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition relative">
            <Bell size={18} className="text-slate-600" />

            {/* Notification Dot */}
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

        </div>
      </div>
      {activeModule?.tabs && activeModule.tabs.length > 0 && (
        <div className="px-6 border-t border-slate-100">
          <div className="flex gap-8 h-12 items-center">
            {activeModule.tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${activeModule.basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `h-full flex items-center border-b-2 text-sm font-medium transition ${
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