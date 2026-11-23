import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/layouts/SideBar";
import Topbar from "@/layouts/TopBar";

function DashBoardLayout() {
  const location = useLocation();
  const [sidebarOpenPath, setSidebarOpenPath] = useState<string | null>(null);
  const sidebarOpen = sidebarOpenPath === location.pathname;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = useCallback(() => {
    if (
      sidebarRef.current?.contains(document.activeElement) &&
      menuButtonRef.current?.getClientRects().length
    ) {
      menuButtonRef.current.focus();
    }
    setSidebarOpenPath(null);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar
        ref={sidebarRef}
        open={sidebarOpen}
        onClose={closeSidebar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <Topbar
          menuButtonRef={menuButtonRef}
          onMenuClick={() => setSidebarOpenPath(location.pathname)}
        />
        <main className="flex-1 overflow-x-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashBoardLayout;
