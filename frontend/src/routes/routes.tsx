import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../modules/auth/pages/LoginForm";
import DashBoardLayout from "../layouts/DashBoardLayout";
import DashBoard from "../modules/dashboard/pages/DashBoard";
import Organization from '../modules/Organization/pages/Organization'
import OrganizationGroup from '../modules/Organization/pages/OrganizationGroup'
import OrganizationUnit from '../modules/Organization/pages/OrganizationUnit'

export default function AppRoutes() {
  return (
<Routes>

  <Route path="/" element={<LoginForm />} />

      <Route  element={<DashBoardLayout />}>
        {/* Default content inside Outlet */}
        <Route index element={<DashBoard />} />
      
      <Route path="/organization" element={<Organization />}>
        <Route path="org-group" element={<OrganizationGroup />} />
         <Route path="org-unit" element={<OrganizationUnit />} />
           {/* <Route path="accounting-year" element={<AccountingYear />} />
            <Route path="finance-month" element={<FinanceMonth />} />
            <Route path="inventory-month" element={<InventoryMonth />} />
            <Route path="gstin" element={<GstinManagement />} />
            <Route path="gst-slate" element={<GstSlateDetails />} /> */}
      </Route>
</Route>
          {/* <Route path="/organization" element={<Organization />}>
        <Route path="org-group" element={<OrgGroup />} />
      </Route>

      <Route path="/organization" element={<DashboardLayout />}>
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