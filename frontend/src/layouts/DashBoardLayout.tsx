import { Outlet } from "react-router-dom";
import Sidebar from "@/layouts/SideBar";
import Topbar from "@/layouts/TopBar";
function DashBoardLayout() {
  return (
   <div className="h-screen bg-slate-50">
  <Sidebar />
  <div className="ml-72 flex flex-col min-h-screen">
    <Topbar />
    <main className="pt-28 px-6 flex-1 overflow-y-auto">
      <Outlet />
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