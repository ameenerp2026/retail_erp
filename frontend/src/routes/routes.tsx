// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginForm from "../modules/auth/pages/LoginForm";
// import DashBoardLayout from "../layouts/DashBoardLayout";
// import DashBoard from "../modules/dashboard/pages/DashBoard";
// import Organization from '../modules/Organization/pages/Organization'
// import OrganizationGroup from '../modules/Organization/pages/OrganizationGroup'
// import OrganizationUnit from '../modules/Organization/pages/OrganizationUnit'

// export default function AppRoutes() {
//   return (
// <Routes>

//   <Route path="/" element={<LoginForm />} />

//       <Route  element={<DashBoardLayout />}>
//         {/* Default content inside Outlet */}
//         <Route index element={<DashBoard />} />
      
//       <Route path="/organization" element={<Organization />}>
//         <Route path="org-group" element={<OrganizationGroup />} />
//          <Route path="org-unit" element={<OrganizationUnit />} />
//            {/* <Route path="accounting-year" element={<AccountingYear />} />
//             <Route path="finance-month" element={<FinanceMonth />} />
//             <Route path="inventory-month" element={<InventoryMonth />} />
//             <Route path="gstin" element={<GstinManagement />} />
//             <Route path="gst-slate" element={<GstSlateDetails />} /> */}
//       </Route>
// </Route>
//           {/* <Route path="/organization" element={<Organization />}>
//         <Route path="org-group" element={<OrgGroup />} />
//       </Route>

//       <Route path="/organization" element={<DashboardLayout />}>
//         <Route path="org-group" element={<OrgGroup />} />
//       </Route>

//      <Route path="/organization" element={<DashboardLayout />}>
//         <Route path="org-group" element={<OrgGroup />} />
//       </Route>

//       <Route path="/finance" element={<DashboardLayout />}>
//         <Route path="ledger" element={<Ledger />} />
//       </Route> */}

//       {/* fallback */}
//       <Route path="*" element={<Navigate to="/" />} />

// </Routes>

//           )}
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../modules/auth/pages/LoginForm"
import DashBoardLayout from "../layouts/DashBoardLayout"
import DashBoard from "../modules/dashboard/pages/DashBoard"
import OrganizationGroup from '../modules/Organization/pages/OrganizationGroup'
import OrganizationUnit from '../modules/Organization/pages/OrganizationUnit';
import AccountGroup from '../modules/Finance/AccountGroup';
import AccountClass from '../modules/Finance/AccountClass';
import Ledger from '../modules/Finance/Ledger';
import SubLedger from '../modules/Finance/SubLedger';
import Currency from '../modules/Finance/Currency';
import Finance from '../modules/Finance/Finance'
import AccountingYearPage from "@/modules/Organization/pages/AccountingYearPage"
import FinanceMonths from "@/modules/Organization/pages/FinanceMonths"
import InventoryMonths from "@/modules/Organization/pages/InventoryMonths"
import RecalculateCOGS from "@/modules/Organization/components/InventoryMonths/RecalculateCOGS"

export default function AppRoutes() {
const { isLoggedIn } = useAuth() 
  
  return (
    <Routes>
      {/* Public route */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/dashboard"/> : <LoginForm />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard"
        element={isLoggedIn ? <DashBoardLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<DashBoard />} />
        <Route path="organization">
          <Route path="org-group" element={<OrganizationGroup />} />
          <Route path="org-unit" element={<OrganizationUnit />} />
          <Route path="accounting-year" element={<AccountingYearPage />} />
          <Route path="finance-month" element={<FinanceMonths />} />
          <Route path="inventory-month" element={<InventoryMonths />} />
           <Route path="recalculate-cogs" element={<RecalculateCOGS />} />
        </Route>
        <Route path="finance" element = {<Finance />}>
           <Route path="account-group" element={<AccountGroup />} />
          <Route path="account-class" element={<AccountClass />} />
           <Route path="ledger" element={<Ledger />} />
            <Route path="sub-ledger" element={<SubLedger />} />
             <Route path="currency" element={<Currency />} />
         
        </Route>
        
      </Route>

      {/* Default + 404 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}