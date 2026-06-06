const actions = [
  {
    label: "Add Org Unit",
    icon: "🏢",
    bg: "bg-slate-200",
  },
  {
    label: "Create Ledger",
    icon: "📒",
    bg: "bg-teal-50",
  },
  {
    label: "Add User",
    icon: "👤",
    bg: "bg-sky-50",
  },
  {
    label: "Import Data",
    icon: "📥",
    bg: "bg-orange-50",
  },
  {
    label: "Gen E-Invoice",
    icon: "🧾",
    bg: "bg-green-50",
  },
  {
    label: "E-Way Bill",
    icon: "🚚",
    bg: "bg-violet-50",
  },
  {
    label: "Manage GSTIN",
    icon: "🧾",
    bg: "bg-red-50",
  },
  {
    label: "View Logs",
    icon: "📋",
    bg: "bg-slate-100",
  },
];

function QuickActions() {
  return (
    <div className="h-full bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
      <h2 className="text-[15px] font-semibold text-[#0F3F91] mb-7">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {actions.map((action) => (
          <button
            key={action.label}
            className="h-[138px] rounded-[20px] bg-slate-50 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 hover:bg-slate-100 transition"
          >
            <div
              className={`w-[62px] h-[62px] rounded-[18px] ${action.bg} flex items-center justify-center text-[28px]`}
            >
              {action.icon}
            </div>

            <p className="text-[11px] font-medium text-slate-600">
              {action.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;