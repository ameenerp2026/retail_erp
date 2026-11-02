
import type { ReactNode } from "react";
import { useAuth } from "@/context/useAuth";

interface CanProps {
  permission: string;
  children: ReactNode;
}

export default function Can({ permission, children }: CanProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
