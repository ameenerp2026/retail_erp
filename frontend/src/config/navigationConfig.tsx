import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface Tab {
  label: string;
  path: string;
}

export interface ModuleRoute {
  label: string;
  icon: LucideIcon;
  basePath: string;
  tabs?: Tab[];
}

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
    icon: ShieldCheck,
    basePath: "/securities",
    tabs:[
      { label: "Roles", path: "roles"},
      { label: "Role Wizard", path: "role-wizard"},
      { label: "Users", path: "users"},
      { label: "User Logs", path: "user-logs"},
    ]
  },

  {
    label: "Utilities",
    icon: Settings,
    basePath: "/utilities",
    tabs:[
       { label: "Data Import", path: "data-import"},
      { label: "E-Invoice Generator", path: "e-invoice"},
      { label: "E-Way Bill Generator", path: "e-way-bill"},
    ]
  },
];