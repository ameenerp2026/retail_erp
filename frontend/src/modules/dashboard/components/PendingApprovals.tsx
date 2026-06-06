const approvals = [
  {
    id: "ORG-091",
    title: "New Branch — Mumbai West",
    requestedBy: "Raj Kumar",
    priority: "High",
    priorityClass: "bg-red-50 text-red-500",
  },
  {
    id: "FIN-204",
    title: "Ledger Opening Balance Update",
    requestedBy: "Priya Sharma",
    priority: "Medium",
    priorityClass: "bg-orange-50 text-orange-500",
  },
  {
    id: "SEC-047",
    title: "Admin Role Assignment — Meena",
    requestedBy: "Admin User",
    priority: "High",
    priorityClass: "bg-red-50 text-red-500",
  },
];

function PendingApprovals() {
  return (
    <div className="h-full bg-white rounded-[15px] border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-[#0F3F91]">
          Pending Approvals
        </h2>

        <span className="bg-orange-50 text-orange-500 px-4 py-1 rounded-full text-[12px] font-semibold">
          3 pending
        </span>
      </div>

      <div className="space-y-5">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 border border-slate-100 rounded-[22px] p-5"
          >
            <div className="flex justify-between items-start">
              <p className="text-[11px] font-semibold text-sky-400">
                {item.id}
              </p>

              <span
                className={`px-3 py-1 rounded-md text-[11px] font-semibold ${item.priorityClass}`}
              >
                {item.priority}
              </span>
            </div>

            <h3 className="text-[12.5px] font-semibold text-slate-700 ">
              {item.title}
            </h3>

            <p className="text-[11px] text-slate-400 mt-2">
              by {item.requestedBy}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button className="h-[35px] rounded-[14px] bg-green-50 text-green-500 font-semibold text-[12px]">
                Approve
              </button>

              <button className="h-[35px] rounded-[14px] bg-red-50 text-red-500 font-semibold text-[12px]">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingApprovals;