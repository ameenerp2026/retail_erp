import { Search, Plus, Moon, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

function Topbar() {
  const location = useLocation();
 const getSegments = () => {
    let path = location.pathname.replace('/dashboard', '');
    if (!path || path === '/') return [];

    return path
     .split('/')
     .filter(Boolean)
     .map(segment => segment.replace(/-/g, ' ')); // ['organization', 'org group']
  };

  const segments = getSegments();
  return (
    <header className="fixed top-0 right-0 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-40" style={{ left: '288px' }}>
      {/* Left Title */}
      <div>
        <h1 className="text-xl font-semibold text-[#043793]">
         {segments.length === 0? (
          <span className="text-[#043793]">dashboard</span>
        ) : (
          <>
            <span className="text-gray-500 font-normal">{segments[0]}</span>
            {segments.length > 1 && (
              <>
                <span className="text-gray-500 font-normal">/</span>
                <span className="text-[#043793]">{segments[1]}</span>
              </>
            )}
          </>
        )}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="w-[280px] h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search modules, records..."
            className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Create Button */}
        <button className="h-10 px-4 rounded-xl bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition">
          <Plus size={18} />
         Quick Create
        </button>

        {/* Theme Button */}
        <button className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
          <Moon size={18} className="text-slate-600" />
        </button>

        {/* Notification Button */}
        <button className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition relative">
          <Bell size={18} className="text-slate-600" />

          {/* Notification Dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

      </div>
    </header>
  );
}

export default Topbar;