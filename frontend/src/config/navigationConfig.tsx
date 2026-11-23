import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Settings,
  Boxes,
  Package,
  Warehouse,
  Layers,
  ArrowLeftRight,
  BarChart2,
} from "lucide-react";

export interface Tab {
  label: string;
  path: string;
  icon?: LucideIcon;
}

export interface ModuleRoute {
  label: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  basePath: string;
  tabs?: Tab[];
}

const SecuritiesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.4989 2.24951H13.497L16.4964 6.74859L8.99797 16.4966L1.49951 6.74859L4.4989 2.24951Z"
      stroke="currentColor"
      strokeWidth="1.49969"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.24807 2.24951L5.99854 6.74859L8.99792 16.4966L11.9973 6.74859L9.74776 2.24951"
      stroke="currentColor"
      strokeWidth="1.49969"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.49951 6.74854H16.4964"
      stroke="currentColor"
      strokeWidth="1.49969"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MODULE_ROUTES: ModuleRoute[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    basePath: "/dashboard",
  },

  {
    label: "Organization",
    icon: Building2,
    basePath: "/organization",
    tabs: [
      { label: "Org Group", path: "org-group" },
      { label: "Org Unit", path: "org-unit" },
      { label: "Business Location", path: "businessLocation" },
      { label: "Accounting Year", path: "accounting-year" },
      { label: "Finance Month", path: "finance-month" },
      { label: "Inventory Month", path: "inventory-month" },
      { label: "GSTIN Management", path: "gstin" },
      { label: "GST State Details", path: "gst-state" },
    ],
  },

  {
    label: "Finance",
    icon: DollarSign,
    basePath: "/finance",
    tabs: [
      { label: "Account Group", path: "account-group" },
      { label: "Account Class", path: "account-class" },
      { label: "Ledger", path: "ledger" },
      { label: "Sub Ledger", path: "sub-ledger" },
      { label: "Currency", path: "currency" },
    ],
  },

  {
    label: "Securities",
    icon: SecuritiesIcon,
    basePath: "/securities",
    tabs: [
      { label: "Roles", path: "roles" },
      { label: "Role Wizard", path: "role-wizard" },
      { label: "Users", path: "users" },
      { label: "User Logs", path: "user-logs" },
      { label: "User License", path: "user-licenses" },
    ],
  },

  {
    label: "Utilities",
    icon: Settings,
    basePath: "/utilities",
    tabs: [
      { label: "Data Import", path: "data-import" },
      { label: "E-Invoice Generator", path: "e-invoice" },
      { label: "E-Way Bill Generator", path: "e-way-bill" },
    ],
  },

  {
    label: "Inventory",
    icon: Boxes,
    basePath: "/inventory",
    tabs: [
      {
        label: "Inventory Dashboard",
        path: "dashboard",
        icon: LayoutDashboard,
      },
      { label: "Product Setup", path: "product-setup", icon: Package },
      {
        label: "Warehouse Management",
        path: "warehouse-management",
        icon: Warehouse,
      },
      {
        label: "Inventory Management",
        path: "inventory-management",
        icon: Layers,
      },
      {
        label: "Inventory Operations",
        path: "inventory-operations",
        icon: ArrowLeftRight,
      },
      { label: "Reports", path: "reports", icon: BarChart2 },
      { label: "Configuration", path: "configuration", icon: Settings },
    ],
  },
];
