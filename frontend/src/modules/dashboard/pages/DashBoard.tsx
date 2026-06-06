//import AdminDashboard from '../DashboardRouter/AdminDashboard';
import TenantAdminDashBoard from './DashboardRouter/TenantAdminDashBoard'

function DashBoard() {

return(
  <>
 < TenantAdminDashBoard/>
  </>
)


  ///Don't delete future use

  //   const user = localStorage.getItem('user') || {} 
  // switch(user.role){
  //   case 'SUPER_ADMIN':
  //   return <AdminDashboard/>

  //   case 'TENANT_ADMIN':
  //       return <TenantAdminDashBoard/>

  //       case 'STORE_MAnager':
  //       return <TenantAdminDashBoard />


  //         default:
  //     return (
  //       <div className="rounded-xl bg-white p-6 shadow-sm">
  //         <h1 className="text-xl font-semibold text-red-600">
  //           Unauthorized Dashboard
  //         </h1>
  //       </div>
  //     );
//  }
}

export default DashBoard