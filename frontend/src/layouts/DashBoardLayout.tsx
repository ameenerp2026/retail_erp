import { Outlet } from "react-router-dom";
import Sidebar from "../modules/dashboard/components/layouts/SideBar";
import Topbar from "../modules/dashboard/components/layouts/TopBar";
function DashBoardLayout() {
  return (
   <div className="min-h-screen bg-slate-50 overflow-x-hidden">
  <Sidebar />
  <div className="ml-72 flex flex-col min-h-screen"  style={{ marginLeft: '288px', width: 'calc(100vw - 288px)' }}>
    <Topbar />
    <main className="fixed overflow-y-auto overflow-x-hidden" 
      style={{ 
        left: '288px', 
        top: '64px', // header height
        right: 0, 
        bottom: 0 
      }}
    >
      <div className="p-6"> {/* Prevents child elements from overflowing */}
        <Outlet />
      </div>
    </main>
  </div>
</div>

//For future use don't delete
//     import SuperAdminDashboard from "./pages/SuperAdminDashboard";
// import TenantAdminDashboard from "./pages/TenantAdminDashboard";
// import StoreManagerDashboard from "./pages/StoreManagerDashboard";

// function DashboardRouter() {

//   const user = JSON.parse(
//     localStorage.getItem("user") || "{}"
//   );

//   switch (user.role) {

//     case "SUPER_ADMIN":
//       return <SuperAdminDashboard />;

//     case "TENANT_ADMIN":
//       return <TenantAdminDashboard />;

//     case "STORE_MANAGER":
//       return <StoreManagerDashboard />;

//     default:
//       return <div>Unauthorized</div>;
//   }
// }

// export default DashboardRouter;
  )
}

export default DashBoardLayout