import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Nov", value: 2400 },
  { month: "Dec", value: 2800 },
  { month: "Jan", value: 3200 },
  { month: "Feb", value: 2900 },
  { month: "Mar", value: 3600 },
  { month: "Apr", value: 4100 },
  { month: "May", value: 4800 },
];

function PlatformActivities() {
  return (
    <div className="w-full  min-h-[420px] bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[18px] font-semibold text-[#0F3F91]">
            Platform Activity
          </h2>
          <p className="text-slate-400 text-[16px] mt-1">
            Logins, transactions & errors
          </p>
        </div>

        <div className="w-[140px] h-[36px] rounded-xl bg-slate-100 border border-slate-200" />
      </div>

      <div className="w-full h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={true}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#94A3B8", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#14B8A6"
              strokeWidth={3}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PlatformActivities;