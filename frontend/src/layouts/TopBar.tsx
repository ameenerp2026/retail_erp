import { Bell, ChevronDown, ChevronRight, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { MODULE_ROUTES } from "@/config/navigationConfig";
import { PRODUCT_SETUP_TABS } from "@/config/productSetupTabs";
import { useAuth } from "@/context/AuthContext";

type TopbarProps = {
  onMenuClick?: () => void;
};

function buildBreadcrumb(pathname: string): string[] {
  const module = MODULE_ROUTES.find((m) => pathname.startsWith(m.basePath));
  if (!module) return ["Dashboard"];

  const parts = [module.label];
  const rest = pathname.slice(module.basePath.length).replace(/^\//, "");
  const [seg, sub] = rest.split("/");

  if (seg) {
    const tab = module.tabs?.find((t) => t.path === seg);
    if (tab) {
      parts.push(tab.label === "Inventory Dashboard" ? "Dashboard" : tab.label);
    }
    if (seg === "product-setup" && sub) {
      const psTab = PRODUCT_SETUP_TABS.find((t) => t.key === sub);
      if (psTab) parts.push(psTab.label);
    }
  }

  return parts;
}

function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const crumbs = buildBreadcrumb(location.pathname);
  const initials = (user?.name ?? "Admin User")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb}-${index}`} className="flex min-w-0 items-center gap-1.5">
                {index > 0 && <ChevronRight size={14} className="shrink-0 text-slate-300" />}
                <span
                  className={`truncate text-sm ${
                    index === crumbs.length - 1
                      ? "font-semibold text-[#043793]"
                      : "text-slate-400"
                  }`}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 xl:flex">
            <div className="relative">
              <select
                defaultValue="FY 2024-2025"
                aria-label="Financial year"
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-[#043793]"
              >
                <option>FY 2024-2025</option>
                <option>FY 2025-2026</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                defaultValue="January 2025"
                aria-label="Period"
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-[#043793]"
              >
                <option>January 2025</option>
                <option>February 2025</option>
                <option>March 2025</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 md:flex xl:w-64">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search inventory…"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              7
            </span>
          </button>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#043793] text-xs font-bold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
