import { Search, Bell, Menu, ChevronRight, ChevronDown, Plus, Moon } from "lucide-react";
import type { Ref } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MODULE_ROUTES } from "@/config/navigationConfig";
import { PRODUCT_SETUP_TABS } from "@/config/productSetupTabs";

type TopbarProps = {
  menuButtonRef?: Ref<HTMLButtonElement>;
  onMenuClick?: () => void;
};

function Topbar({ menuButtonRef, onMenuClick }: TopbarProps) {
  const location = useLocation();
  const isInventory = location.pathname.startsWith("/inventory");
  const isProductSetup = location.pathname.startsWith("/inventory/product-setup");

  const activeModule = MODULE_ROUTES.find((module) =>
    location.pathname.startsWith(module.basePath)
  );

  // Determine current product setup tab label if applicable
  const currentSubTab = PRODUCT_SETUP_TABS.find((t) =>
    location.pathname.endsWith(`/${t.key}`)
  );
  const currentSubTabLabel = currentSubTab?.label ?? "Products";

  // Determine current inventory section title if on another inventory page
  const currentInventoryTab = activeModule?.tabs?.find((t) =>
    location.pathname.includes(t.path)
  );
  const currentInventorySectionTitle = currentInventoryTab?.label ?? "Dashboard";

  // Current tab for other modules
  const currentModuleTab = activeModule?.tabs?.find(
    (t) =>
      location.pathname.endsWith(`/${t.path}`) ||
      location.pathname.includes(`/${t.path}`)
  );
  const currentModuleTabTitle =
    currentModuleTab?.label === "Business Location"
      ? "Business Locations"
      : currentModuleTab?.label;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-13 sm:h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu button & Breadcrumbs */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            ref={menuButtonRef}
            onClick={onMenuClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <nav
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium"
            aria-label="Breadcrumb"
          >
            {isInventory ? (
              <>
                <Link
                  to="/inventory/dashboard"
                  className="text-[#155DFC] hover:underline"
                >
                  Inventory
                </Link>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                {isProductSetup ? (
                  <>
                    <Link
                      to="/inventory/product-setup/products"
                      className="text-[#155DFC] hover:underline"
                    >
                      Product Setup
                    </Link>
                    <ChevronRight size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-800 font-semibold truncate">
                      {currentSubTabLabel}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-800 font-semibold truncate">
                    {currentInventorySectionTitle}
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to={activeModule?.basePath ?? "/"}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  {activeModule?.label ?? "Dashboard"}
                </Link>
                {currentModuleTabTitle && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-semibold truncate">
                      {currentModuleTabTitle}
                    </span>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Right: Selectors, Search, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Inventory-specific Financial Year & Month Selectors */}
          {isInventory && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer">
                <span>FY 2024 - 2025</span>
                <ChevronDown size={13} className="text-slate-400" />
              </div>

              <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer">
                <span>January 2025</span>
                <ChevronDown size={13} className="text-slate-400" />
              </div>
            </>
          )}

          {/* Global Search Bar */}
          <div className="relative flex items-center">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder={isInventory ? "Search inventory..." : "Search modules, records..."}
              className="h-8 w-36 sm:w-48 md:w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#043793] focus:ring-1 focus:ring-[#043793]"
            />
          </div>

          {/* Quick Create Button */}
          <button
            type="button"
            className="hidden sm:flex h-8 items-center gap-1.5 rounded-lg bg-[#093055] px-3 text-xs font-medium text-white shadow-xs transition hover:bg-[#072440]"
          >
            <Plus size={14} />
            <span>Quick Create</span>
          </button>

          {/* Theme Toggle (Dark Mode) */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label="Toggle theme"
          >
            <Moon size={16} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-1.5 cursor-pointer rounded-lg px-1.5 py-1 transition hover:bg-slate-50">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#093055] text-xs font-bold text-white shadow-2xs">
              AD
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-700">
              Admin
            </span>
            <ChevronDown size={13} className="hidden md:inline text-slate-400" />
          </div>
        </div>
      </div>

      {/* Only render horizontal tabs for non-inventory modules */}
      {!isInventory && activeModule?.tabs && activeModule.tabs.length > 0 && (
        <div className="border-t border-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 scrollbar-none sm:gap-6">
            {activeModule.tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${activeModule.basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap border-b-2 px-2 py-3 text-sm font-medium transition sm:px-0 ${
                    isActive
                      ? "border-[#043793] text-[#043793] font-semibold"
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
