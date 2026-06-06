import { ArrowDown, ArrowUp,  } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  change: number;
  description: string;
  badgeColor: string;
  iconColor:string
};

function KpiCard({ title, value, icon: Icon, change, description, badgeColor , iconColor}: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 min-w-50 min-h-33.75">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${badgeColor}`} >
          <Icon size={22} className={iconColor} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(change)}%
        </span>

        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default KpiCard;