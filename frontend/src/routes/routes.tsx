import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../modules/auth/pages/LoginForm";
import DashBoardLayout from "../layouts/DashBoardLayout";
import DashBoard from "../modules/dashboard/pages/DashBoard";


export default function AppRoutes() {
  return (
<Routes>

  <Route path="/" element={<LoginForm />} />

      <Route path="/dashboard" element={<DashBoardLayout />}>
        {/* Default content inside Outlet */}
        <Route index element={<DashBoard />} />
      </Route>

          {/* <Route path="/organization" element={<DashboardLayout />}>
        <Route path="org-group" element={<OrgGroup />} />
      </Route>

     <Route path="/organization" element={<DashboardLayout />}>
        <Route path="org-group" element={<OrgGroup />} />
      </Route>

      <Route path="/finance" element={<DashboardLayout />}>
        <Route path="ledger" element={<Ledger />} />
      </Route> */}

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

</Routes>

          )}