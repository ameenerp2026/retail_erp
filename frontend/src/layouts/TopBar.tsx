import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  Plus,
  Moon,
  ChevronDown,
} from "lucide-react";
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
  const isProductSetup = location.pathname.startsWith(
    "/inventory/product-setup",
  );

  const activeModule = MODULE_ROUTES.find((module) =>
    location.pathname.startsWith(module.basePath),
  );

  // Determine current product setup tab label if applicable
  const currentSubTab = PRODUCT_SETUP_TABS.find((t) =>
    location.pathname.endsWith(`/${t.key}`),
  );
  const currentSubTabLabel = currentSubTab?.label ?? "Products";

  // Determine current inventory section title if on another inventory page
  const currentInventoryTab = activeModule?.tabs?.find((t) =>
    location.pathname.includes(t.path),
  );
  const currentInventorySectionTitle =
    currentInventoryTab?.label ?? "Dashboard";

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
                    <ChevronRight
                      size={13}
                      className="text-slate-400 shrink-0"
                    />
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
              <span className="text-slate-800 font-semibold text-sm">
                {activeModule?.label ?? "Dashboard"}
              </span>
            )}
          </nav>
        </div>

        {/* Right: Search, Quick Create, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search modules, records..."
              className="h-9 w-36 sm:w-48 md:w-60 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-[#155DFC]"
            />
          </div>

          {/* Quick Create */}
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#043793] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#032d76]"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Quick Create</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
          >
            <Moon size={16} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Admin Profile */}
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B2A6B] text-[10px] font-bold text-white">
              AD
            </span>
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
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
