
import { Users, Hotel, Shield, TriangleAlert } from "lucide-react";
import KpiCard from '../../components/KPICards';
import PlatformActivities from '../../components/PlatformActivities';
import ModuleUsage from '../../components/ModuleUsage';
import AuditLog from '../../components/AuditLogs';
import PendingApprovals from '../../components/PendingApprovals'
import StorageUsage from '../../components/StorageUsage';
import QuickActions from '../../components/QuickActions'

function TenantAdminDashBoard() {
  return (
    <div className="bg-[#F1F5F9]">
    <div className="text-[#043793] font-bold text-[24px] font-['Manrope']">Tenant Admin DashBoard</div>
    {/* KPI Cards */}
    <div className="flex gap-9">
 
    <KpiCard 
    title="Active Users"
        value="48"
        icon={Users}
        change={12}
        description="from last month"
        badgeColor="bg-blue-100"
        iconColor="text-blue-600"
    />

       <KpiCard
        title="Org Units"
        value="34"
        icon={Hotel}
        change={3}
        description="This Month "
         badgeColor="bg-green-100"
        iconColor="text-green-600"
      />

      <KpiCard
        title="Active Roles"
        value="22"
        icon={Shield}
        change={-1}
        description="vs last month"
          badgeColor="bg-sky-100"
        iconColor="text-sky-600"
      />

      <KpiCard
        title="Pending"
        value="7"
        icon={TriangleAlert}
        change={2}
        description="Needs Action"
        badgeColor="bg-orange-100"
        iconColor="text-orange-600"
      />

      <KpiCard
        title="Failed Logins"
        value="156"
        icon={TriangleAlert}
        change={18}
        description="last 24 hours"
          badgeColor="bg-red-100"
        iconColor="text-red-600"
      />
       </div>
    

    {/* PlatformActivities */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-stretch">
      <div className="lg:col-span-8 h-full">
    <PlatformActivities />
    </div>
    <div className="lg:col-span-4 h-full">
    <ModuleUsage />
    </div>
    </div>


      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8 items-stretch">
      <div className="xl:col-span-8">
        <AuditLog />
      </div>

      <div className="xl:col-span-4">
        <PendingApprovals />
      </div>
    </div>


     <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8 items-stretch">
      <div className="xl:col-span-4">
        <StorageUsage />
      </div>

      <div className="xl:col-span-8">
        <QuickActions />
      </div>
    </div>

    </div>
   
  )
}

export default TenantAdminDashBoard