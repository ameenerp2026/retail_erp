const roleColors: Record<string, string> = {
  "Super Admin": "#EF4444",
  "Finance Manager": "#2563EB",
  "Inventory Manager": "#22C55E",
  "Sales Manager": "#F97316",
  "Store Manager": "#9333EA",
  Employee: "#6B7280",
};

export const getRoleColor = (roleName: string): string => {
  return roleColors[roleName] ?? "#6B7280";
};