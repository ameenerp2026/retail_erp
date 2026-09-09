import { useState } from "react";
import { SecuritiesCard } from "../components/SecuritiesCard";

function Roles() {
  const [_isModalOpen, setIsModalOpen] = useState(false);

  const roles = [
    {
      id: 1,
      roleName: "Super Admin",
      roleType: "SUPER ADMIN",
      description: "Full system access across all modules.",
      userCount: 2,
      permissionCount: 48,
      status: "ACTIVE",
      createdAt: "2026-08-01",
      updatedAt: "2026-08-10",
      color: "RED" as const,
    },
    {
      id: 2,
      roleName: "Finance Manager",
      roleType: "MANAGER",
      description:
        "Manage finance, ledgers, accounting and financial reports.",
      userCount: 8,
      permissionCount: 18,
      status: "ACTIVE",
      createdAt: "2026-08-02",
      updatedAt: "2026-08-12",
      color: "BLUE" as const,
    },
    {
      id: 3,
      roleName: "Inventory Manager",
      roleType: "MANAGER",
      description:
        "Manage inventory, warehouses and stock movement.",
      userCount: 5,
      permissionCount: 21,
      status: "ACTIVE",
      createdAt: "2026-08-03",
      updatedAt: "2026-08-15",
      color: "GREEN" as const,
    },
    {
      id: 4,
      roleName: "Sales Manager",
      roleType: "MANAGER",
      description:
        "Manage sales activities and customer operations.",
      userCount: 10,
      permissionCount: 15,
      status: "ACTIVE",
      createdAt: "2026-08-04",
      updatedAt: "2026-08-15",
      color: "ORANGE" as const,
    },
    {
      id: 5,
      roleName: "Store Manager",
      roleType: "MANAGER",
      description:
        "Manage daily store operations and employees.",
      userCount: 4,
      permissionCount: 12,
      status: "ACTIVE",
      createdAt: "2026-08-05",
      updatedAt: "2026-08-16",
      color: "PURPLE" as const,
    },
    {
      id: 6,
      roleName: "Employee",
      roleType: "STANDARD",
      description:
        "Basic access to assigned modules and screens.",
      userCount: 25,
      permissionCount: 6,
      status: "ACTIVE",
      createdAt: "2026-08-06",
      updatedAt: "2026-08-16",
      color: "GRAY" as const,
    },
  ];

  return (
    <>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Roles</h1>
            <p className="page-subtitle">Manage user roles and permissions</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="page-actions flex items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 py-2.5 text-sm font-medium text-white cursor-pointer"
          >
            <span>+</span> Create Role
          </button>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <SecuritiesCard key={role.id} {...role} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Roles;