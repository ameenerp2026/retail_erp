import { MODULE_ROUTES } from "@/config/navigationConfig";
import { forwardRef, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, X, ChevronDown, ChevronRight, ChevronsUpDown, Package } from "lucide-react";
import { useAuth } from "@/context/useAuth";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  function Sidebar({ open = false, onClose }, ref) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [isDesktop, setIsDesktop] = useState(() =>
      window.matchMedia("(min-width: 1024px)").matches
    );

    const isInventoryRoute = location.pathname.startsWith("/inventory");
    const [inventoryExpanded, setInventoryExpanded] = useState(true);

    useEffect(() => {
      if (isInventoryRoute) {
        setInventoryExpanded(true);
      }
    }, [isInventoryRoute]);

    useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

      mediaQuery.addEventListener("change", updateIsDesktop);
      return () => mediaQuery.removeEventListener("change", updateIsDesktop);
    }, []);

    const isHidden = !open && !isDesktop;

    return (
      <aside
        ref={ref}
        className={`
        fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col
        bg-[#043793] text-white
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
        aria-hidden={isHidden}
        inert={isHidden}
      >
        <div className="flex h-full flex-col px-4 pt-4 pb-4">
          {/* Brand */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A3A7A] text-lg font-bold text-white shadow-sm">
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

          <div className="mb-3 h-px bg-[#5B8BC6]/40" />

          {/* Tenant */}
          <div className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#2B4B8C] bg-[#1A3A7A] p-3 shadow-sm transition hover:border-[#3b62b3]">
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
            <ChevronDown size={16} className="text-white/60 shrink-0" />
          </div>

          {/* Nav */}
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-4 hide-scrollbar">
            {MODULE_ROUTES.map((module) => {
              const Icon = module.icon;
              const isModuleActive = location.pathname.startsWith(module.basePath);
              const isInventory = module.basePath === "/inventory";

              if (isInventory) {
                return (
                  <div key={module.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isInventoryRoute) {
                          navigate("/inventory/product-setup/products");
                        }
                        setInventoryExpanded((prev) => !prev);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isModuleActive
                          ? "bg-[#155DFC] text-white shadow-sm"
                          : "text-white/90 hover:bg-[#1A3A7A]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon size={18} className="shrink-0 opacity-95" />
                        <span className="truncate">{module.label}</span>
                      </div>
                      {inventoryExpanded ? (
                        <ChevronDown size={16} className="shrink-0 text-white" />
                      ) : (
                        <ChevronRight size={16} className="shrink-0 text-white/80" />
                      )}
                    </button>

                    {/* Expandable sub-menu */}
                    {inventoryExpanded && module.tabs && (
                      <div className="space-y-0.5 pt-0.5">
                        {module.tabs.map((tab) => {
                          const SubIcon = tab.icon || Package;
                          const toPath =
                            tab.path === "product-setup"
                              ? "/inventory/product-setup/products"
                              : `${module.basePath}/${tab.path}`;

                          const isTabActive =
                            tab.path === "product-setup"
                              ? location.pathname.startsWith("/inventory/product-setup")
                              : location.pathname === toPath ||
                                location.pathname.startsWith(`${module.basePath}/${tab.path}`);

                          return (
                            <NavLink
                              key={tab.path}
                              to={toPath}
                              onClick={onClose}
                              className={`flex items-center gap-3 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                                isTabActive
                                  ? "bg-[#0B2A6B] text-white shadow-inner font-semibold"
                                  : "text-white/80 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <SubIcon size={16} className="shrink-0 opacity-90" />
                              <span className="truncate">{tab.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

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
                    isModuleActive
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

          <div className="mb-3 h-px bg-[#5B8BC6]/40" />

          {/* User Profile */}
          <div className="mb-2 flex w-full items-center justify-between rounded-xl border border-[#2B4B8C]/40 bg-[#1A3A7A]/60 p-2.5 shadow-sm">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1848B0] border border-[#2D62DC] text-xs font-bold text-white shadow-sm">
                AR
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  {user?.name || "Arjun Sharma"}
                </p>
                <p className="truncate text-[11px] text-[#8FA8D4]">
                  Inventory Manager
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ChevronsUpDown size={15} className="text-white/60 shrink-0" />
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }
);

export default Sidebar;
