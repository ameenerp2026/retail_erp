

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Building,
  Calendar,
  Package,
  FileText,
  CreditCard,
  DollarSign,
  BookMarked,
  NotebookTabs,
  LibraryBig,
  Receipt,
  ShieldCheck,
  UserRoundKey,
  Upload,

  ChevronDown,
  ChevronRight,
  Users,
  Settings,
  BookOpen,
  BadgeIndianRupee,
  FileCog,
} from "lucide-react";

const menuItems = [
  {
    label: "Organization",
    icon: Building2,
    children: [
      { label: "Org Group", path: "/dashboard/organization/org-group", icon: Building2 },
      { label: "Org Unit", path: "/dashboard/organization/org-unit", icon: Building },
      { label: "Accounting Year", path: "/dashboard/organization/accounting-year", icon: Calendar },
      { label: "Finance Month", path: "/dashboard/organization/finance-month", icon: CreditCard },
      { label: "Inventory Month", path: "/dashboard/organization/inventory-month", icon: Package },
      { label: "GSTIN Management", path: "/organization/gstin", icon: FileText },
      { label: "GST Slate Details", path: "/organization/gst-slate", icon: CreditCard },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    children: [
      { label: "Account Group", path: "/dashboard/finance/account-group", icon: BookOpen },
      { label: "Account Class", path: "/dashboard/finance/account-class", icon: BookMarked },
      { label: "Ledger", path: "/dashboard/finance/ledger", icon: LibraryBig },
      { label: "Sub Ledger", path: "/dashboard/finance/sub-ledger", icon: NotebookTabs },
      { label: "Currency", path: "/dashboard/finance/currency", icon: BadgeIndianRupee },
    ],
  },
  {
    label: "Securities",
    icon: ShieldCheck,
    children: [
      { label: "Roles", path: "/securities/roles", icon: UserRoundKey },
      { label: "Role Wizard", path: "/securities/role-wizard", icon: FileCog },
      { label: "Users", path: "/securities/users", icon: Users },
      { label: "User Logs", path: "/securities/user-logs", icon: FileText },
    ],
  },
  {
    label: "Utilities",
    icon: Settings,
    children: [
      { label: "Data Import", path: "/utilities/data-import", icon: Upload },
      { label: "E-Invoice Generator", path: "/utilities/e-invoice", icon: Receipt },
      { label: "E-Way Bill Generator", path: "/utilities/e-way-bill", icon: FileText },
    ],
  },
];

function SidebarMenuItem({ item }: any) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-3 text-white">
            <Icon size={18} />
            {item.label}
          </span>

          {open ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
        </button>

        {open && (
          <div className="ml-8 mt-1 flex flex-col gap-1 whitespace-nowrap">
            {item.children.map((child: any) => {
              const ChildIcon = child.icon;

              return (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive
                      ? "bg-blue-600 text-slate-60"
                      : "text-white"
                    }`
                  }
                >
                  <ChildIcon size={16} />
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function Sidebar() {
   const location = useLocation();
  console.log('Current path:', location.pathname); 
  return (
    <div className="flex">
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#043793] text-white flex flex-col fixed">
    
      <div className="px-4 pt-4 flex-shrink-0">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1A3A7A] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
            S
          </div>
          <div>
            <h2 className="text-white font-bold text- font-['Plus_Jakarta_Sans'] leading-tight">STREAMYS</h2>
            <p className="text-[#5B8BC6] font-normal tracking-[2px] text-xs font-['Plus_Jakarta_Sans'] whitespace-nowrap leading-tight">
              RETAIL SAAS
            </p>
          </div>
        </div>
        {/* Thin divider - 1px */}
        <div className="h-[1px] bg-[#5B8BC6] -mx-4 mb-2 opacity-60"></div>
        {/* Tenant Card */}
        <div className="bg-[#1A3A7A] rounded-xl p-3 flex items-center justify-between w-full cursor-pointer mb-4 border border-[#2B4B8C]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-[#4ADE80] rounded-lg flex items-center justify-center text-[#0B2A6B] font-bold text-sm shrink-0">
              RS
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold whitespace-nowrap">RetailShop India</p>
              <p className="text-[#8FA8D4] text-xs">Admin Tenant</p>
            </div>
          </div>
        </div>
        {/* Dashboard - active with left accent */}
       <NavLink 
  to="/dashboard"
  className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#1A4A8A] text-white w-full overflow-hidden mb-4"
>
  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4ADE80] rounded-l-xl"></div>
  <svg className="w-5 h-5 shrink-0 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
  <span className="text-sm font-semibold">Dashboard</span>
</NavLink>
       <div className="flex-1 overflow-y-auto min-h-0 px-4">
        <nav className="flex flex-col gap-2 pb-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label} item={item} />
          ))}
        </nav>
        </div>
        
        {/* Thin divider - 1px */}
        <div className="h-[1px] bg-[#5B8BC6] -mx-4 mb-2 opacity-60"></div>

        <div className="bg-[#1A3A7A]/60 rounded-xl p-3 flex items-center justify-between w-full cursor-pointer mb-3 border border-[#2B4B8C]/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-[#2B4B8C] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold">Admin User</p>
              <p className="text-[#8FA8D4] text-xs">admin@streamys.in</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        {/* Collapse button */}
        <button className="w-full bg-[#1A3A7A]/40 hover:bg-[#1A3A7A]/60 rounded-xl py-3 flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

    </aside>
    </div>
  );
}

