import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Finance", value: 38, color: "#0F5CA8" },
  { name: "Organization", value: 24, color: "#22B8B0" },
  { name: "Securities", value: 20, color: "#4FC3F7" },
  { name: "Utilities", value: 18, color: "#F59E0B" },
];

function ModuleUsage() {
  return (
    <div className="h-full min-h-[420px] bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
      <div>
        <h2 className="text-[18px] font-semibold text-[#0F3F91]">
          Module Usage
        </h2>

        <p className="text-[14px] text-slate-400 mt-1">
          Activity distribution
        </p>
      </div>

      <div className="h-[180px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={4}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-[14px]"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 text-[12px]">{item.name}</span>
            </div>

            <span className="font-semibold text-[12px] text-[#0F3F91]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModuleUsage;