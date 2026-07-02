import { MODULE_ROUTES } from "@/config/navigationConfig";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
   const location = useLocation();
  console.log('Current path:', location.pathname); 
  return (
    <div className="flex">
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#043793] z-50 text-white flex flex-col fixed">
    
      <div className="px-4 pt-4 flex-shrink-0">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1A3A7A] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
            S
          </div>
          <div>
            <h2 className="text-white font-bold text- font-['Plus_Jakarta_Sans'] leading-tight">STREAMYS</h2>
            <p className="text-[#5B8BC6] font-normal tracking-[2px] text-xs font-['Plus_Jakarta_Sans'] whitespace-nowrap leading-tight">
              RETAIL SAAS
            </p>
          </div>
        </div>
        {/* Thin divider - 1px */}
        <div className="h-[1px] bg-[#5B8BC6] -mx-4 mb-2 opacity-60"></div>
        {/* Tenant Card */}
        <div className="bg-[#1A3A7A] rounded-xl p-3 flex items-center justify-between w-full cursor-pointer mb-4 border border-[#2B4B8C]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-[#4ADE80] rounded-lg flex items-center justify-center text-[#0B2A6B] font-bold text-sm shrink-0">
              RS
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold whitespace-nowrap">RetailShop India</p>
              <p className="text-[#8FA8D4] text-xs">Admin Tenant</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 px-4">
       <nav className="flex flex-col gap-2 pb-4">
  {MODULE_ROUTES.map((module) => {
    const Icon = module.icon;

    return (
      <NavLink
        key={module.label}
        to={
          module.tabs?.length
            ? `${module.basePath}/${module.tabs[0].path}`
            : module.basePath
        }
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl ${
            isActive
              ? "bg-gradient-to-r from-[#2B6CB0] to-[#1A4A8A] text-white"
              : "text-white hover:bg-[#1A3A7A]"
          }`
        }
      >
        <Icon size={18} />
        <span>{module.label}</span>
      </NavLink>
    );
  })}
</nav>
        </div>
        
        {/* Thin divider - 1px */}
        <div className="h-[1px] bg-[#5B8BC6] -mx-4 mb-2 opacity-60"></div>

        <div className="bg-[#1A3A7A]/60 rounded-xl p-3 flex items-center justify-between w-full cursor-pointer mb-3 border border-[#2B4B8C]/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-[#2B4B8C] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold">Admin User</p>
              <p className="text-[#8FA8D4] text-xs">admin@streamys.in</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        {/* Collapse button */}
        <button className="w-full bg-[#1A3A7A]/40 hover:bg-[#1A3A7A]/60 rounded-xl py-3 flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

    </aside>
    </div>
  );
}

