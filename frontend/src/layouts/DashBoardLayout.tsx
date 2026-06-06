import { Outlet } from "react-router-dom";
import Sidebar from "../modules/dashboard/components/layouts/SideBar";
import Topbar from "../modules/dashboard/components/layouts/TopBar";
function DashBoardLayout() {
  return (
   <div className="min-h-screen flex bg-slate-50">

      <Sidebar />

       <div className="flex-1 flex flex-col">
             <Topbar />
     <main className="flex-1 overflow-y-auto">
  <div className="p-6">
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