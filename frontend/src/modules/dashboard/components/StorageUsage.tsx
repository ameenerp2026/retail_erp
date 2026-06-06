const storageItems = [
  {
    label: "Database",
    value: 68,
    color: "bg-[#0F5CA8]",
  },
  {
    label: "Documents",
    value: 42,
    color: "bg-[#22B8B0]",
  },
  {
    label: "Media",
    value: 85,
    color: "bg-[#F59E0B]",
  },
];

function StorageUsage() {
  return (
    <div className="h-full bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
      <h2 className="text-[15px] font-semibold text-[#0F3F91] mb-8">
        Storage Usage
      </h2>

      <div className="space-y-7">
        {storageItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] text-slate-600">
                {item.label}
              </p>

              <p className="text-[12px] font-semibold text-[#0F3F91]">
                {item.value}%
              </p>
            </div>

            <div className="w-full h-[12px] bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorageUsage;