import type { ReactNode } from "react";
import { useAuth } from "@/context/useAuth";

interface CanProps {
  permission: string;
  children: ReactNode;
}

export default function Can({ permission, children }: CanProps) {
  const { hasPermission, user } = useAuth();

  if (
    user &&
    user.role?.toUpperCase() !== "ADMIN" &&
    user.role?.toUpperCase() !== "SUPERADMIN" &&
    !hasPermission(permission)
  ) {
    return null;
  }

  return <>{children}</>;
}
