import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const SECURITIES_PERMISSIONS = [
  "ROLE_VIEW",
  "ROLE_CREATE",
  "ROLE_EDIT",
  "ROLE_DELETE",
  "USER_VIEW",
  "USER_CREATE",
  "USER_EDIT",
  "USER_DELETE",
  "USER_ROLE_ASSIGN",
  "AUDIT_LOG_VIEW",
  "AUDIT_LOG_EXPORT",
];

function Securities() {
  const { hasPermission } = useAuth();

  const hasSecuritiesAccess = SECURITIES_PERMISSIONS.some((permission) =>
    hasPermission(permission),
  );
  if (!hasSecuritiesAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default Securities;
