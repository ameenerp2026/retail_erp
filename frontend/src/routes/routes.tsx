import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../modules/auth/pages/LoginForm"
import DashBoardLayout from "../layouts/DashBoardLayout"
import DashBoard from "../modules/dashboard/pages/DashBoard"
import OrganizationGroup from '../modules/Organization/pages/OrganizationGroup'
import OrganizationUnit from '../modules/Organization/pages/OrganizationUnit';
import AccountGroup from '../modules/Finance/pages/AccountGroup';
import AccountClass from '../modules/Finance/pages/AccountClass';
import Ledger from '../modules/Finance/pages/Ledger';
import SubLedger from '../modules/Finance/pages/SubLedger';
import Currency from '../modules/Finance/pages/Currency';
import Finance from '../modules/Finance/Finance'
import AccountingYearPage from "@/modules/Organization/pages/AccountingYearPage"
import FinanceMonths from "@/modules/Organization/pages/FinanceMonths"
import InventoryMonths from "@/modules/Organization/pages/InventoryMonths"
import RecalculateCOGS from "@/modules/Organization/components/InventoryMonths/RecalculateCOGS"
import GSTINManagement from "@/modules/Organization/pages/GSTINManagement"
import GSTStateDetails from "@/modules/Organization/pages/GSTStateDetails"
import Securities from "@/modules/Securities/Securities"
import Roles from "@/modules/Securities/pages/Roles"
import RoleWizard from "@/modules/Securities/pages/RoleWizard"
import Users from "@/modules/Securities/pages/Users"
import UserLogs from "@/modules/Securities/pages/UserLogs"

export default function AppRoutes() {
const { isLoggedIn } = useAuth() 
  
  return (
  <Routes>
    {/* Public Route */}
    <Route
      path="/login"
      element={
        isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />
      }
    />

    {/* Protected Layout */}
    <Route
      element={
        isLoggedIn ? (
          <DashBoardLayout />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    >
      <Route path="/dashboard" element={<DashBoard />} />

      <Route path="/organization">
        <Route path="org-group" element={<OrganizationGroup />} />
        <Route path="org-unit" element={<OrganizationUnit />} />
        <Route path="accounting-year" element={<AccountingYearPage />} />
        <Route path="finance-month" element={<FinanceMonths />} />
        <Route path="inventory-month" element={<InventoryMonths />} />
        <Route path="recalculate-cogs" element={<RecalculateCOGS />} />
        <Route path="gstin" element={<GSTINManagement />} />
        <Route path="gst-state" element={<GSTStateDetails />} />
      </Route>

      <Route path="/finance" element={<Finance />}>
        <Route path="account-group" element={<AccountGroup />} />
        <Route path="account-class" element={<AccountClass />} />
        <Route path="ledger" element={<Ledger />} />
        <Route path="sub-ledger" element={<SubLedger />} />
        <Route path="currency" element={<Currency />} />
      </Route>

      <Route path="/securities" element={<Securities />}>
        <Route index element={<Navigate to="roles" replace />} />
        <Route path="roles" element={<Roles />} />
        <Route path="role-wizard" element={<RoleWizard />} />
        <Route path="users" element={<Users />} />
        <Route path="user-logs" element={<UserLogs />} />
      </Route>
    </Route>

    {/* Default Route */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
}