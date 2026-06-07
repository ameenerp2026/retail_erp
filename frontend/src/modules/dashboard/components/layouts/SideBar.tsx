

import { useState } from "react";
import { NavLink } from "react-router-dom";
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
      { label: "Org Group", path: "/organization/org-group", icon: Building2 },
      { label: "Org Unit", path: "/organization/org-unit", icon: Building },
      { label: "Accounting Year", path: "/organization/accounting-year", icon: Calendar },
      { label: "Finance Month", path: "/organization/finance-month", icon: CreditCard },
      { label: "Inventory Month", path: "/organization/inventory-month", icon: Package },
      { label: "GSTIN Management", path: "/organization/gstin", icon:FileText },
      { label: "GST Slate Details", path: "/organization/gst-slate", icon: CreditCard },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    children: [
      { label: "Account Group", path: "/finance/account-group", icon: BookOpen },
      { label: "Account Class", path: "/finance/account-class", icon: BookMarked},
      { label: "Ledger", path: "/finance/ledger", icon: LibraryBig },
      { label: "Sub Ledger", path: "/finance/sub-ledger", icon:  NotebookTabs },
      { label: "Currency", path: "/finance/currency", icon: BadgeIndianRupee },
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
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-3 text-white">
            <Icon size={18} />
            {item.label}
          </span>

          {open ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
        </button>

        {open && (
          <div className="ml-8 mt-1 flex flex-col gap-1">
            {item.children.map((child: any) => {
              const ChildIcon = child.icon;

              return (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      isActive
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
  return (
    <aside className="w-[300px] min-h-screen bg-[#043793] text-white   border-r border-slate-200 p-4">
      <div className="flex ">
       <p className="w-[55px] h-[55px] flex items-center justify-center text-[16px]  font-bold mb-6 bg-gradient-to-r from-[#093055] to-[#043793] rounded-3xl text-white">
  S
</p>
        <div className="text-white px-4 my-2">
            <h2 className='text-white font-bold text-[15px] font-["Plus_Jakarta_Sans]'> STREAMYS</h2>
            <p className=' text-[12px] text-gray-400 font-normal tracking-[2px] font-["Plus_Jakarta_Sans] '>RETAIL SAAS</p>
        </div>
      </div>
    
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}

