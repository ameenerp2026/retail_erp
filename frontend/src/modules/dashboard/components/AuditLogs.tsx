import { Clock } from "lucide-react";

const auditLogs = [
  {
    user: "Priya Sharma",
    module: "Finance",
    action: "Created Ledger",
    time: "2m ago",
    color: "bg-teal-500",
  },
  {
    user: "Raj Kumar",
    module: "Organization",
    action: "Updated Org Unit",
    time: "12m ago",
    color: "bg-sky-400",
  },
  {
    user: "Admin User",
    module: "Securities",
    action: "Role Permission Changed",
    time: "34m ago",
    color: "bg-sky-400",
  },
  {
    user: "Meena Joshi",
    module: "Utilities",
    action: "E-Invoice Generated",
    time: "1h ago",
    color: "bg-teal-500",
  },
  {
    user: "System",
    module: "Auth",
    action: "Failed Login Attempt (3x)",
    time: "1h ago",
    color: "bg-red-500",
  },
  {
    user: "Arun Patel",
    module: "Utilities",
    action: "Data Import Completed",
    time: "2h ago",
    color: "bg-green-500",
  },
];

function AuditLog() {
  return (
    <div className="h-full bg-white rounded-[15px] border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F3F91]">
            Recent Audit Log
          </h2>
          <p className="text-[12px] text-slate-400 mt-1">
            Last 6 system events
          </p>
        </div>

        <button className="text-[#14B8A6] text-[12px] font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {auditLogs.map((log, index) => (
          <div
            key={index}
            className="min-h-[75px] bg-slate-50 rounded-[22px] px-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <span className={`w-[10px] h-[10px] rounded-full ${log.color}`} />

              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[12.5px] font-semibold text-slate-700">
                    {log.user}
                  </p>

                  <span className="text-[12px] text-sky-400 bg-sky-50 px-3 py-1 rounded-md">
                    {log.module}
                  </span>
                </div>

                <p className="text-[12px] text-slate-400">
                  {log.action}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Clock size={11} />
              <span>{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditLog;