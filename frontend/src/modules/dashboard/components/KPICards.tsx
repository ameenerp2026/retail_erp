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
    <div className="min-h-[7.5rem] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="stat-value mt-1.5 text-slate-900">{value}</h3>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${badgeColor}`} >
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5">
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