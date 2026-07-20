import { Outlet } from "react-router-dom"

function SecurityPlaceholder() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-semibold text-slate-900">Security Module</h2>
      <p className="mt-2 text-sm text-slate-600">
        The security routes are now wired and ready for their feature pages.
      </p>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default SecurityPlaceholder
